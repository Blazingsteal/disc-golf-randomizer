<template>
  <div class="h-100 w-100 d-flex flex-column justify-center align-center overflow-hidden">
    <div class="pointer"/>
    <Pizza
      ref="pizza"
      :wheel-items="wheelItems"
      :size="navStore.canvasSize"
      :style="rotationStyle"
      @click="animate"
    />
  </div>
  <v-dialog
    v-model="navStore.showSettings"
    :fullscreen="true"
    :close-on-back="true"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-btn
          icon
          dark
          @click="closeSettingsDialog()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row :dense="true">
          <v-col cols="12">
            <v-checkbox
              v-model="navStore.all"
              label="Include all in wheel chooser"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="canvasSizeInput"
              variant="outlined"
              density="compact"
              label="Size of canvas (px)"
              type="number"
              :clearable="true"
            >
              <template #append>
                <v-btn
                  @click="applyNewSize()"
                  color="primary"
                  variant="outlined"
                  size="large"
                >
                  Apply
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="canvasFontSizeInput"
              variant="outlined"
              density="compact"
              label="Font size in canvas (px)"
              type="number"
              :clearable="true"
            >
              <template #append>
                <v-btn
                  @click="applyNewSize()"
                  color="primary"
                  variant="outlined"
                  size="large"
                >
                  Apply
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="canvasPointerOffsetInput"
              variant="outlined"
              density="compact"
              label="Pointer offset (px)"
              type="number"
              :clearable="true"
            >
              <template #append>
                <v-btn
                  @click="applyNewSize()"
                  color="primary"
                  variant="outlined"
                  size="large"
                >
                  Apply
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="rotationsInput"
              variant="outlined"
              density="compact"
              label="Number of rotations. Minimum >= 3"
              min="3"
              type="number"
              :clearable="true"
            >
              <template #append>
                <v-btn
                  @click="setNewRotations()"
                  color="primary"
                  variant="outlined"
                  size="large"
                >
                  Apply
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <ListComponent
              :items="shotSelection"
              title="Shot selector"
              @delete-item="idx => deleteItem(0, idx)"
              @new-item="addItem(0)"
            />
          </v-col>
          <v-col cols="12">
            <ListComponent
              :items="discSelection"
              title="Disc selector"
              @delete-item="idx => deleteItem(1, idx)"
              @new-item="addItem(1)"
            />
          </v-col>
          <v-col cols="12">
            <ListComponent
              :items="puttingStyleSelection"
              title="Putting style selector"
              @delete-item="idx => deleteItem(2, idx)"
              @new-item="addItem(2)"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import Pizza from "@/components/Pizza.vue";
import ListComponent from "@/components/ListComponent.vue";
import {onMounted, ref, watch} from "vue";
import {navStore} from "@/store/navStore";
import {Preferences} from "@capacitor/preferences"

const pizza = ref<InstanceType<typeof Pizza> | null>(null);
const rotationStyle = ref("");
const canvasSizeInput = ref(`${navStore.canvasSize}`);
const canvasFontSizeInput = ref(`${navStore.fontSize}`);
const canvasPointerOffsetInput = ref("22");
const rotationsInput = ref("3");
const pointerOffset = ref(`-${navStore.canvasSize - parseInt(canvasPointerOffsetInput.value)}px`);
const currentRotation = ref(0);
const shotSelection = ref<string[]>([]);
const discSelection = ref<string[]>([]);
const puttingStyleSelection = ref<string[]>([]);
const wheelSelector = ref(["Shot selection", "Disc selection", "Putting selection"]);
const wheelItems = ref(wheelSelector.value);
const newChanges = ref(false);


function animate() {
  if (!navStore.spin) {
    setTimeout(() => {
      const degrees = getRandomDegrees();
      currentRotation.value += degrees;

      rotationStyle.value = `transform: rotate(${currentRotation.value}deg); transition-duration: 3000ms;`;

      navStore.spin = true;
      setTimeout(() => {
        navStore.spin = false;
      }, 3000);
    }, 50);
  }
}

function getRandomDegrees() {
  const minDegrees = 720;
  const maxDegrees = 360 * navStore.rotations;
  return Math.floor(Math.random() * (maxDegrees - minDegrees + 1) + minDegrees);
}


function reset() {
  rotationStyle.value = "";
  currentRotation.value = 0;
}

watch(() => navStore.currentMode,
  (newValue, oldValue) => {
    switch (newValue) {
      case 0:
        wheelItems.value = wheelSelector.value;
        navStore.fontSize = 45;
        break;
      case 1:
        wheelItems.value = shotSelection.value;
        navStore.fontSize = 33;
        break;
      case 2:
        wheelItems.value = discSelection.value;
        navStore.fontSize = 38;
        break;
      case 3:
        wheelItems.value = puttingStyleSelection.value;
        navStore.fontSize = 25;
        break;
      case 4:
        wheelItems.value = [
          ...shotSelection.value,
          ...discSelection.value,
          ...puttingStyleSelection.value
        ];
        navStore.fontSize = 25;
        break;
      case 6:
        reset();
        navStore.currentMode = oldValue;
        break;
    }
  }
);

watch(() => navStore.all,
  (newValue, _) => {
    if (newValue) {
      wheelSelector.value = ["Shot selection", "Disc selection", "Putting selection", "All"];
      if (navStore.currentMode === 0) {
        wheelItems.value = wheelSelector.value;
        reDrawCanvas();
      }
    } else {
      wheelSelector.value = ["Shot selection", "Disc selection", "Putting selection"];
      if (navStore.currentMode === 0) {
        wheelItems.value = wheelSelector.value;
        reDrawCanvas();
      }
    }
  }
);

function deleteItem(mode: number, idx: number) {
  switch (mode) {
    case 0:
      shotSelection.value.splice(idx, 1);
      newChanges.value = true;
      break;
    case 1:
      discSelection.value.splice(idx, 1);
      newChanges.value = true;
      break;
    case 2:
      puttingStyleSelection.value.splice(idx, 1);
      newChanges.value = true;
      break;
  }
}

function addItem(mode: number) {
  switch (mode) {
    case 0:
      shotSelection.value.push("");
      newChanges.value = true;
      break;
    case 1:
      discSelection.value.push("");
      newChanges.value = true;
      break;
    case 2:
      puttingStyleSelection.value.push("");
      newChanges.value = true;
      break;
  }
}


function closeSettingsDialog() {
  if (newChanges.value) {
    saveNewWheelValues();
    newChanges.value = false;
  }
  navStore.showSettings = false;
}

async function saveNewWheelValues() {
  if (shotSelection.value.length) {
    await Preferences.set({
      key: "shotSelection",
      value: JSON.stringify(shotSelection.value)
    });
  }
  if (discSelection.value.length) {
    await Preferences.set({
      key: "discSelection",
      value: JSON.stringify(discSelection.value)
    });
  }
  if (puttingStyleSelection.value.length) {
    await Preferences.set({
      key: "puttingStyleSelection",
      value: JSON.stringify(puttingStyleSelection.value)
    });
  }
  await Preferences.set({
    key: "fontSize",
    value: `${navStore.fontSize}`
  });
  await Preferences.set({
    key: "canvasSize",
    value: `${navStore.canvasSize}`
  });
  await Preferences.set({
    key: "rotations",
    value: `${navStore.rotations}`
  });
  await Preferences.set({
    key: "canvasPointerOffset",
    value: canvasPointerOffsetInput.value
  });
}

function setNewRotations() {
  const newRotations = parseInt(rotationsInput.value);
  if (newRotations && newRotations >= 3) {
    navStore.rotations = newRotations;
    newChanges.value = true;
  } else {
    navStore.rotations = 3;
  }
}

function applyNewSize() {
  if (canvasSizeInput.value) {
    navStore.canvasSize = parseInt(canvasSizeInput.value);
    pointerOffset.value = `-${navStore.canvasSize - parseInt(canvasPointerOffsetInput.value)}px`;
    navStore.fontSize = parseInt(canvasFontSizeInput.value);
    newChanges.value = true;
    setTimeout(() => {
      reDrawCanvas();
    }, 100);
  }
}

function reDrawCanvas() {
  pizza.value?.drawCircle();
}


onMounted(async () => {
  /* Load any values from local storage */
  const localShotSelections = await Preferences.get({key: "shotSelection"});
  const localDiscSelections = await Preferences.get({key: "discSelection"});
  const localPuttingStyleSelection = await Preferences.get({key: "puttingStyleSelection"});
  const localFontSize = await Preferences.get({key: "fontSize"});
  const localCanvasSize = await Preferences.get({key: "canvasSize"});
  const localRotations = await Preferences.get({key: "rotations"});
  const localCanvasPointerOffset = await Preferences.get({key: "canvasPointerOffset"});
  if (localShotSelections.value) {
    const arr = JSON.parse(localShotSelections.value);
    if (arr.length) {
      shotSelection.value = arr;
    } else {
      shotSelection.value = navStore.orgValues.shotSelection.slice();
    }
  } else {
    shotSelection.value = navStore.orgValues.shotSelection.slice();
  }
  if (localDiscSelections.value) {
    const arr = JSON.parse(localDiscSelections.value);
    if (arr.length) {
      discSelection.value = arr;
    } else {
      discSelection.value = navStore.orgValues.discSelection.slice();
    }
  } else {
    discSelection.value = navStore.orgValues.discSelection.slice();
  }
  if (localPuttingStyleSelection.value) {
    const arr = JSON.parse(localPuttingStyleSelection.value);
    if (arr.length) {
      puttingStyleSelection.value = arr;
    } else {
      puttingStyleSelection.value = navStore.orgValues.puttingStyleSelection.slice();
    }
  } else {
    puttingStyleSelection.value = navStore.orgValues.puttingStyleSelection.slice();
  }
  if (localFontSize.value) {
    navStore.fontSize = parseInt(JSON.parse(localFontSize.value));
    canvasFontSizeInput.value = `${navStore.fontSize}`;
  }
  if (localCanvasSize.value) {
    navStore.canvasSize = parseInt(JSON.parse(localCanvasSize.value));
    canvasSizeInput.value = `${navStore.canvasSize}`;
  }
  if (localRotations.value) {
    navStore.rotations = parseInt(JSON.parse(localRotations.value));
    rotationsInput.value = `${navStore.rotations}`;
  }
  if (localCanvasPointerOffset.value) {
    canvasPointerOffsetInput.value = JSON.parse(localCanvasPointerOffset.value);
    pointerOffset.value = `-${navStore.canvasSize - parseInt(canvasPointerOffsetInput.value)}px`;
  }
});

</script>

<style>
.pointer {
  position: absolute;
  z-index: 1;
  border-top: 15px solid rgb(var(--v-theme-secondary));
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  width: 0;
  height: 0;
  margin-top: v-bind(pointerOffset);
}
</style>
