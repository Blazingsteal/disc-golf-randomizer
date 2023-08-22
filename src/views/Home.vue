<template>
  <div class="h-100 w-100 d-flex flex-column justify-center align-center overflow-hidden">
    <div class="pointer"/>
    <span v-if="showSelectedItem" class="selected-item text-h5 text-center">{{ selectedItem }}</span>
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
            <v-checkbox v-model="navStore.all" label="Include all in wheel chooser"/>
          </v-col>
          <v-col cols="12">
            <div class="py-4">
              <v-text-field
                v-model="canvasSizeInput"
                variant="outlined"
                density="compact"
                color="primary"
                label="Size of canvas (px)"
                type="number"
                :clearable="true"
                hide-details
              />
              <v-slider
                v-model="canvasSizeInput"
                max="1000"
                min="150"
                step="1"
                hide-details
                color="primary"
                density="compact"
              />
            </div>
          </v-col>
          <v-col cols="12">
            <div class="py-4">
              <v-text-field
                v-model="canvasFontSizeInput"
                variant="outlined"
                density="compact"
                color="primary"
                label="Font size in canvas (px)"
                type="number"
                :clearable="true"
                hide-details
              />
              <v-slider
                v-model="canvasFontSizeInput"
                max="100"
                min="15"
                step="1"
                hide-details
                color="primary"
                density="compact"
              />
            </div>
          </v-col>
          <v-col cols="12">
            <div class="py-4">
              <v-text-field
                v-model="canvasPointerOffsetInput"
                variant="outlined"
                density="compact"
                color="primary"
                label="Pointer offset (px)"
                type="number"
                :clearable="true"
                hide-details
              />
              <v-slider
                v-model="canvasPointerOffsetInput"
                max="100"
                min="1"
                step="1"
                hide-details
                color="primary"
                density="compact"
              />
            </div>
          </v-col>
          <v-col cols="12">
            <div class="py-4">
              <v-text-field
                v-model="rotationsInput"
                variant="outlined"
                density="compact"
                color="primary"
                label="Number of rotations. Minimum >= 3"
                min="3"
                type="number"
                :clearable="true"
                hide-details
              />
              <v-slider
                v-model="rotationsInput"
                max="1000"
                min="3"
                step="1"
                hide-details
                color="primary"
                density="compact"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-center">
            <v-btn
              @click="applyNewSettings()"
              color="primary"
              variant="outlined"
              size="large"
            >
              Save
            </v-btn>
          </v-col>
          <v-col cols="12" class="d-flex justify-center">
            <v-btn
              color="error"
              variant="outlined"
              size="large"
              append-icon="mdi-delete"
              @click="resetToDefaults()"
            >
              Reset to defaults
            </v-btn>
          </v-col>
        </v-row>
        <ListComponent
          :items="shotSelection"
          title="Shot selector"
          @delete-item="idx => deleteItem(0, idx)"
          @new-item="addItem(0)"
        />
        <ListComponent
          :items="discSelection"
          title="Disc selector"
          @delete-item="idx => deleteItem(1, idx)"
          @new-item="addItem(1)"
        />
        <ListComponent
          :items="puttingStyleSelection"
          title="Putting style selector"
          @delete-item="idx => deleteItem(2, idx)"
          @new-item="addItem(2)"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import Pizza from "@/components/Pizza.vue";
import ListComponent from "@/components/ListComponent.vue";
import {onMounted, ref, watch} from "vue";
import {navStore} from "@/store/navStore";
import {Preferences} from "@capacitor/preferences";
import {App} from "@capacitor/app";

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
const selectedItem = ref("");
const showSelectedItem = ref(false);


function animate() {
  if (!navStore.spin) {
    setTimeout(() => {
      showSelectedItem.value = false;
      const degrees = getRandomDegrees();
      currentRotation.value += degrees;

      rotationStyle.value = `transform: rotate(${currentRotation.value}deg); transition-duration: 3000ms;`;

      const selectedItemIndex = (wheelItems.value.length - (currentRotation.value % 360 / 360) * wheelItems.value.length) % wheelItems.value.length;
      selectedItem.value = wheelItems.value[Math.floor(selectedItemIndex)];


      navStore.spin = true;
      setTimeout(() => {
        navStore.spin = false;
        showSelectedItem.value = true;
      }, 3000);
    }, 50);
  }
}

function getRandomDegrees() {
  const minDegrees = 720;
  const maxDegrees = 360 * navStore.rotations;
  return Math.floor(Math.random() * (maxDegrees - minDegrees + 1) + minDegrees);
}

watch(() => navStore.currentMode,
  (newValue, _) => {
    showSelectedItem.value = false;
    switch (newValue) {
      case 0:
        wheelItems.value = wheelSelector.value;
        navStore.fontSize = 45;
        canvasFontSizeInput.value = `${navStore.fontSize}`;
        break;
      case 1:
        wheelItems.value = shotSelection.value;
        navStore.fontSize = 33;
        canvasFontSizeInput.value = `${navStore.fontSize}`;
        break;
      case 2:
        wheelItems.value = discSelection.value;
        navStore.fontSize = 38;
        canvasFontSizeInput.value = `${navStore.fontSize}`;
        break;
      case 3:
        wheelItems.value = puttingStyleSelection.value;
        navStore.fontSize = 25;
        canvasFontSizeInput.value = `${navStore.fontSize}`;
        break;
      case 4:
        wheelItems.value = [
          ...shotSelection.value,
          ...discSelection.value,
          ...puttingStyleSelection.value
        ];
        navStore.fontSize = 25;
        canvasFontSizeInput.value = `${navStore.fontSize}`;
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

function applyNewSettings() {
  setNewRotations();
  applyNewSize();
}

function setNewRotations() {
  if (rotationsInput.value) {
    const newRotations = parseInt(rotationsInput.value);
    if (newRotations && newRotations >= 3) {
      navStore.rotations = newRotations;
      newChanges.value = true;
    } else {
      navStore.rotations = 3;
      rotationsInput.value = `${navStore.rotations}`;
    }
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
      shotSelection.value = navStore.orgShotSelection.slice();
    }
  } else {
    shotSelection.value = navStore.orgShotSelection.slice();
  }
  if (localDiscSelections.value) {
    const arr = JSON.parse(localDiscSelections.value);
    if (arr.length) {
      discSelection.value = arr;
    } else {
      discSelection.value = navStore.orgDiscSelection.slice();
    }
  } else {
    discSelection.value = navStore.orgDiscSelection.slice();
  }
  if (localPuttingStyleSelection.value) {
    const arr = JSON.parse(localPuttingStyleSelection.value);
    if (arr.length) {
      puttingStyleSelection.value = arr;
    } else {
      puttingStyleSelection.value = navStore.orgPuttingStyleSelection.slice();
    }
  } else {
    puttingStyleSelection.value = navStore.orgPuttingStyleSelection.slice();
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

function resetToDefaults() {
  navStore.resetToDefaults();
  shotSelection.value = navStore.orgShotSelection.slice();
  discSelection.value = navStore.orgDiscSelection.slice();
  puttingStyleSelection.value = navStore.orgPuttingStyleSelection.slice();
  canvasFontSizeInput.value = `${navStore.fontSize}`;
  canvasSizeInput.value = `${navStore.canvasSize}`;
  rotationsInput.value = `${navStore.rotations}`;
  canvasPointerOffsetInput.value = "22";
  pointerOffset.value = `-${navStore.canvasSize - parseInt(canvasPointerOffsetInput.value)}px`;
  rotationStyle.value = "";
  currentRotation.value = 0;
  showSelectedItem.value = false;
  selectedItem.value = "";
  saveNewWheelValues();
}

App.addListener("backButton", ({canGoBack}) => {
  /* OBS Entire event is Android only */
  if (navStore.showSettings) {
    navStore.showSettings = false;
  } else if (canGoBack) {
    window.history.back();
  } else {
    App.exitApp();
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

.selected-item {
  position: absolute;
  z-index: 2;
  top: 10%;
}
</style>
