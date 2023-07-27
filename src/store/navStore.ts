import {reactive} from "vue";

export const navStore = reactive({
  currentMode: 0,
  spin: false,
  all: false,
  showSettings: false,
  canvasSize: 380,
  fontSize: 45,
  navBar: false
});