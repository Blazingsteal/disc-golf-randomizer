<template>
  <div class="w-100 h-screen d-flex flex-column justify-center align-center">
    <div class="wrapper">
      <div class="pointer"></div>
      <div class="chart" :style="rotationStyle">
        <div
          v-for="(item, idx) in wheelItems"
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

const wheelItems = ref([
  "item 1", "item 2", "item 3", "item 4", "item 5",
  "item 6", "item 7", "item 8", "item 9", "item 10",
  "item 11", "item 12",
]);
const spin = ref(false);
const rotationStyle = ref("");
const resultItem = ref();

// const showResult = ref(false);

function calculateRotation(index: number) {
  const sliceAngle = 360 / wheelItems.value.length;
  return `transform: rotate(${sliceAngle * index}deg) skewY(-60deg);`;
}

function animate() {
  if (!spin.value) {
    reset();
    setTimeout(() => {
      const degrees = getRandomDegrees();
      const result = Math.floor(degrees / 30 % wheelItems.value.length);
      resultItem.value = wheelItems.value[result];

      rotationStyle.value = `transform: rotate(${degrees}deg); transition-duration: 3000ms;`;

      spin.value = true;
      setTimeout(() => {
        // showResult.value = true;
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
  width: 20em;
  height: 20em;
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
  padding: 10px;
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
