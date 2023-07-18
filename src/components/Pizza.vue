<template>
  <canvas class="rotated-canvas" ref="pizzaCanvas" :width="size" :height="size"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

defineExpose({
  drawCircle
});

const props = defineProps<{
  wheelItems: string[],
  size: number | string
}>()

const pizzaCanvas = ref();

function drawCircle() {
  if (pizzaCanvas.value) {
    const context = pizzaCanvas.value.getContext("2d");
    const height = pizzaCanvas.value.height;
    const width = pizzaCanvas.value.width;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const sliceAngle = (2 * Math.PI) / props.wheelItems.length;

    const evenColor = "#245889";
    const oddColor = "#2690f2";
    const thirdColor = "#39669d";
    let oddLengthIndex = 0;

    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();

    for (let i = 0; i < props.wheelItems.length; i++) {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = (i + 1) * sliceAngle - Math.PI / 2;
      const sliceCenterAngle = (startAngle + endAngle) / 2;

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX, centerY, radius, startAngle, endAngle);
      context.closePath();
      if (props.wheelItems.length % 2 === 0) {
        context.fillStyle = i % 2 === 0 ? evenColor : oddColor;
      } else {
        switch (oddLengthIndex) {
          case 0:
            context.fillStyle = evenColor;
            oddLengthIndex++;
            break;
          case 1:
            context.fillStyle = oddColor;
            oddLengthIndex++;
            break;
          case 2:
            context.fillStyle = thirdColor;
            oddLengthIndex++;
            break;
        }
      }
      context.fill();
      context.stroke();

      const textRadius = radius * 0.9;
      const textX = centerX + textRadius * Math.cos(sliceCenterAngle);
      const textY = centerY + textRadius * Math.sin(sliceCenterAngle);
      const textRotation = sliceCenterAngle + Math.PI;

      context.save();
      context.translate(textX, textY);
      context.rotate(textRotation);
      context.fillStyle = "black";
      context.textAlign = "start";
      context.textBaseline = "middle";
      context.font = "bold 14px Arial";
      context.fillText(props.wheelItems[i], 0, 0);
      context.restore();
    }
  }
}

onMounted(() => {
  drawCircle();
});


watch(() => props.wheelItems,
  () => {
    drawCircle();
  }
);

</script>

<style scoped>
.rotated-canvas {
  transform: rotate(-15deg);
}
</style>