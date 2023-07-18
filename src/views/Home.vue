<template>
  <div class="w-100 h-screen d-flex flex-column justify-center align-center">
    <div class="pointer"/>
    <Pizza
      :wheel-items="wheelItems"
      :size="canvasSize"
      :style="rotationStyle"
    />
    <div class="d-flex">
      <v-btn
        variant="outlined"
        color="primary"
        @click="animate"
      >
        spin
      </v-btn>
      <v-btn
        variant="outlined"
        color="primary"
        class="ml-2"
        @click="reset"
      >
        reset
      </v-btn>
    </div>
  </div>
  <v-layout>
    <v-bottom-navigation
      v-model="mode"
      color="primary"
      :grow="true"
    >
      <v-btn>
        <v-icon icon="mdi-disc"/>
        Wheel
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-chart-timeline-variant"/>
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
    </v-bottom-navigation>
  </v-layout>
</template>

<script lang="ts" setup>
import Pizza from "@/components/Pizza.vue";
import {ref, watch} from "vue";

const spin = ref(false);
const rotationStyle = ref("");
const canvasSize = ref(750);
const pointerOffset = ref(`-${canvasSize.value}px`);
const currentRotation = ref(0);
const mode = ref(0);
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
const putting = ref([
  "Turbo put",
  "Jump putt",
  "Distance driver as putter (highest speed in bag)",
  "Scoober",
  "Left-hand put",
  "Right-hand putt",
]);
const wheelSelector = ref([
  "Shot selection",
  "Disc selection",
  "Putting selection"
]);
const wheelItems = ref(wheelSelector.value);


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

watch(() => mode.value,
  (newValue, _) => {
    switch (newValue) {
      case 0:
        wheelItems.value = wheelSelector.value
        break;
      case 1:
        wheelItems.value = shotSelection.value
        break;
      case 2:
        wheelItems.value = discSelection.value
        break;
      case 3:
        wheelItems.value = putting.value
        break;
    }
  })

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
