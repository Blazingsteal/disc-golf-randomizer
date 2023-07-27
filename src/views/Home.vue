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
          @click="navStore.showSettings = false"
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
                  @click="applyNewSize"
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
                  @click="applyNewSize"
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
                  @click="applyNewSize"
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
              :items="puttingSelection"
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
import {ref, watch} from "vue";
import {navStore} from "@/store/navStore";

const spin = ref(false);
const pizza = ref<InstanceType<typeof Pizza> | null>(null);
const rotationStyle = ref("");
const canvasSizeInput = ref(`${navStore.canvasSize}`);
const canvasFontSizeInput = ref(`${navStore.fontSize}`);
const canvasPointerOffsetInput = ref("22");
const pointerOffset = ref(`-${navStore.canvasSize - parseInt(canvasPointerOffsetInput.value)}px`);
const currentRotation = ref(0);
const shotSelection = ref([
  "Stand still",
  "Backhand roller",
  "Forehand roller",
  "Backhand",
  "Forehand",
  "Tomahawk",
  "Left-hand throw",
  "Right-hand throw",
  "Spin 3 times into throw",
  "Spin 2 times into jump throw",
  "1 time use discs (round)",
  "Loose hole = loose a disc (round)",
  "Missed shot = loose disc (hole)",
]);
const discSelection = ref([
  "Distance driver",
  "Fairway driver",
  "Mid range",
  "Putter only",
  "Berg only",
  "Most overstable disc",
  "Most understable disc",
  "Most stable disc",
  "Highest speed disc",
  "Lowest speed disc",
  "Mini off the tee",
  "One disc only (entire hole)",
]);
const puttingSelection = ref([
  "Turbo put",
  "Jump putt",
  "Distance driver as putter (highest speed)",
  "Scoober",
  "Left-hand putt",
  "Right-hand putt",
]);
const wheelSelector = ref([
  "Shot selection",
  "Disc selection",
  "Putting selection"
]);
const wheelItems = ref(wheelSelector.value);


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
  const maxDegrees = 1080;
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
        wheelItems.value = puttingSelection.value;
        navStore.fontSize = 25;
        break;
      case 4:
        wheelItems.value = [
          ...shotSelection.value,
          ...discSelection.value,
          ...puttingSelection.value
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
      break;
    case 1:
      discSelection.value.splice(idx, 1);
      break;
    case 2:
      puttingSelection.value.splice(idx, 1);
      break;
  }
}

function addItem(mode: number) {
  switch (mode) {
    case 0:
      shotSelection.value.push("");
      break;
    case 1:
      discSelection.value.push("");
      break;
    case 2:
      puttingSelection.value.push("");
      break;
  }
}

function applyNewSize() {
  if (canvasSizeInput.value) {
    navStore.canvasSize = parseInt(canvasSizeInput.value);
    pointerOffset.value = `-${navStore.canvasSize - parseInt(canvasPointerOffsetInput.value)}px`;
    navStore.fontSize = parseInt(canvasFontSizeInput.value);
    setTimeout(() => {
      reDrawCanvas();
    }, 100);
  }
}

function reDrawCanvas() {
  pizza.value?.drawCircle();
}


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
