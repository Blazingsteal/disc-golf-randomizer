<template>
  <canvas class="rotated-canvas" ref="pizzaCanvas" :width="newSize" :height="newSize"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {navStore} from "@/store/navStore";

defineExpose({
  drawCircle
});

const props = defineProps<{
  wheelItems: string[],
  size: number | string
}>()

const newSize = ref(props.size as number * Math.ceil(window.devicePixelRatio));

watch(() => props.size,
  (newValue, _) => {
    pizzaCanvas.value.style.width = `${newValue}px`;
    pizzaCanvas.value.style.height = `${newValue}px`;
    const ratio = Math.ceil(window.devicePixelRatio);
    const context = pizzaCanvas.value.getContext("2d");
    newSize.value = newValue as number * Math.ceil(window.devicePixelRatio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    console.log("Got new size, redrawing")
    setTimeout(() => {
      drawCircle()
    }, 100);
  }
);


const pizzaCanvas = ref();

function drawCircle() {
  if (pizzaCanvas.value) {
    console.log("Drawing")
    pizzaCanvas.value.style.width = `${props.size}px`;
    pizzaCanvas.value.style.height = `${props.size}px`;
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
      const evenSize = props.wheelItems.length % 2 === 0;
      if (evenSize) {
        context.fillStyle = i % 2 === 0 ? evenColor : oddColor;
      } else if (!evenSize && (i === props.wheelItems.length - 1) && (props.wheelItems.length > 3)) {
        context.fillStyle = oddColor;
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
      if (oddLengthIndex >= 3) {
        oddLengthIndex = 0;
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
      context.font = `bold ${navStore.fontSize}px Arial`;
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