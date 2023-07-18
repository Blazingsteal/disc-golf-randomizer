<template>
  <div class="w-100 h-screen d-flex flex-column justify-center align-center">
    <div class="wrapper">
      <div class="pointer"></div>
      <div class="chart" :style="rotationStyle">
        <div
          v-for="(item, idx) in shotSelection"
          :key="idx"
          class="slice"
          :style="calculateRotation(idx)"
        >
          <div class="label">{{ item }}</div>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <v-btn
        variant="outlined"
        color="primary"
        @click="animate"
      >
        spin
      </v-btn>
      <!--      <div> {{ resultItem }}</div>-->
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
</template>

<script lang="ts" setup>
import {ref} from "vue";

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
  "Once a disc is used it cannot be used again",
  "Loose a hole loose a disc", // (the rest of the card gets to choose a disc you threw that hole, which cannot be used again this round)
  "On each missed basket shot, that disc cannot be used again (current hole)",
]);



const spin = ref(false);
const rotationStyle = ref("");
const sliceAngle = ref(30);


function calculateRotation(index: number) {
  const sliceAngle = 360 / shotSelection.value.length;
  return `transform: rotate(${sliceAngle * index}deg) skewY(-60deg);`;
}

function animate() {
  if (!spin.value) {
    reset();
    setTimeout(() => {
      const degrees = getRandomDegrees();

      rotationStyle.value = `transform: rotate(${degrees}deg); transition-duration: 3000ms;`;

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
}

//background-color: rgb(var(--v-theme-primary));
</script>

<style>
.chart {
  position: relative;
  border: 1px solid black;
  padding: 0;
  margin: 1em auto;
  width: 50vw;
  height: 50vh;
  border-radius: 50%;
  overflow: hidden;
  transform: rotate(-15deg);
}

.slice {
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: 0% 100%;
}

.label {
  position: absolute;
  left: -100%;
  width: 200%;
  height: 200%;
  text-align: center;
  transform: skewY(60deg) rotate(15deg);
  padding: 20px;
}

.slice:nth-child(even) .label {
  background-color: rgb(var(--v-theme-primary-darken-1));
}

.slice:nth-child(odd) .label {
  background-color: rgb(var(--v-theme-primary-selected));
}


.pointer {
  position: absolute;
  z-index: 1;
  left: 50%;
  border-top: 15px solid rgb(var(--v-theme-secondary));
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  width: 0;
  height: 0;
  margin-top: 17px;
  margin-left: -5px;
}
</style>
