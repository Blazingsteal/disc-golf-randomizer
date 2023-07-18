<template>
  <div class="h-100 w-100 d-flex flex-column justify-center align-center overflow-hidden">
    <div class="pointer"/>
    <Pizza
      ref="pizza"
      :wheel-items="wheelItems"
      :size="canvasSize"
      :style="rotationStyle"
    />
    <v-bottom-navigation
      v-model="mode.current"
      color="primary"
      :mandatory="true"
    >
      <v-btn>
        <v-icon icon="mdi-disc"/>
        Wheel
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-strategy"/>
        Shot
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-disc"/>
        Discs
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-disc"/>
        Putting
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-all-inclusive"/>
        All
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-wrench"/>
        Settings
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-reload"/>
        Spin
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-restore"/>
        Reset
      </v-btn>
    </v-bottom-navigation>
  </div>
  <v-dialog
    v-model="showSettingsDialog"
    @update:model-value="resetMode"
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
          @click="() => {resetMode(); showSettingsDialog = false;}"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row :dense="true">
          <v-col cols="6">
            <v-checkbox
              v-model="includeAll"
              label="Include all in wheel chooser"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="canvasSizeInput"
              variant="outlined"
              density="compact"
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
          <v-col cols="6">
            <ListComponent
              :items="shotSelection"
              title="Shot"
              @delete-item="idx => deleteItem(0, idx)"
              @new-item="addItem(0)"
            />
          </v-col>
          <v-col cols="6">
            <ListComponent
              :items="discSelection"
              title="Discs"
              @delete-item="idx => deleteItem(1, idx)"
              @new-item="addItem(1)"
            />
          </v-col>
          <v-col cols="12">
            <ListComponent
              :items="puttingSelection"
              title="Putting"
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

const spin = ref(false);
const pizza = ref<InstanceType<typeof Pizza> | null>(null);
const rotationStyle = ref("");
const canvasSizeInput = ref("750");
const canvasSize = ref(750);
const pointerOffset = ref(`-${canvasSize.value - 35}px`);
const currentRotation = ref(0);
const mode = ref({
  current: 0,
  previous: 0
});
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
  "Mini off the tee",
  "One disc only (entire hole)",
]);
const puttingSelection = ref([
  "Turbo put",
  "Jump putt",
  "Distance driver as putter (highest speed in bag)",
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
const showSettingsDialog = ref(false);
const includeAll = ref(false);


function animate() {
  if (!spin.value) {
    setTimeout(() => {
      const degrees = getRandomDegrees();
      currentRotation.value += degrees;

      rotationStyle.value = `transform: rotate(${currentRotation.value}deg); transition-duration: 3000ms;`;

      spin.value = true;
      setTimeout(() => {
        spin.value = false;
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

watch(() => mode.value.current,
  (newValue, oldValue) => {
    switch (newValue) {
      case 0:
        wheelItems.value = wheelSelector.value;
        break;
      case 1:
        wheelItems.value = shotSelection.value;
        break;
      case 2:
        wheelItems.value = discSelection.value;
        break;
      case 3:
        wheelItems.value = puttingSelection.value;
        break;
      case 4:
        wheelItems.value = [
          ...shotSelection.value,
          ...discSelection.value,
          ...puttingSelection.value
        ];
        break;
      case 5:
        showSettingsDialog.value = true;
        mode.value.previous = oldValue;
        break;
      case 6:
        animate();
        mode.value.current = oldValue;
        break;
      case 7:
        reset();
        mode.value.current = oldValue;
        break;
    }
  }
);

watch(() => includeAll.value,
  (newValue, _) => {
    if (newValue) {
      wheelSelector.value = ["Shot selection", "Disc selection", "Putting selection", "All"];
    } else {
      wheelSelector.value = ["Shot selection", "Disc selection", "Putting selection"];
    }
  }
);

function resetMode() {
  mode.value.current = mode.value.previous;
}

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
    canvasSize.value = parseInt(canvasSizeInput.value);
    pointerOffset.value = `-${canvasSize.value - 35}px`;
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
