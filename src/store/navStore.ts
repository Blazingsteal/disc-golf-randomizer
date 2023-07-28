import {reactive} from "vue";

const originalShotSelectionValues = [
  "Stand still", "Backhand roller",
  "Forehand roller", "Backhand",
  "Forehand", "Tomahawk",
  "Left-hand throw", "Right-hand throw",
  "Spin 3 times into throw", "Spin 2 times into jump throw",
  "1 time use discs (round)", "Loose hole = loose a disc (round)",
  "Missed shot = loose disc (hole)",
];

const originalDiscSelectionValues = [
  "Distance driver", "Fairway driver",
  "Mid range", "Putter only",
  "Berg only", "Most overstable disc",
  "Most understable disc", "Most stable disc",
  "Highest speed disc", "Lowest speed disc",
  "Mini off the tee", "One disc only (entire hole)",
];

const originalPuttingStyleValues = [
  "Turbo put", "Jump putt",
  "Distance driver as putter (highest speed)",
  "Scoober", "Left-hand putt", "Right-hand putt",
];

export const navStore = reactive({
  currentMode: 0,
  spin: false,
  all: false,
  rotations: 3,
  showSettings: false,
  canvasSize: 380,
  fontSize: 45,
  navBar: false,
  orgValues: {
    shotSelection: originalShotSelectionValues,
    discSelection: originalDiscSelectionValues,
    puttingStyleSelection: originalPuttingStyleValues
  }
});