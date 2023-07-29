import {reactive} from "vue";

const defaults = {
  rotations: 3,
  canvasSize: 380,
  fontSize: 45,
  shotSelectionValues: [
    "Stand still", "Backhand roller",
    "Forehand roller", "Backhand",
    "Forehand", "Tomahawk",
    "Left-hand throw", "Right-hand throw",
    "Spin 3 times into throw", "Spin 2 times into jump throw",
    "1 time use discs (round)", "Loose hole = loose a disc (round)",
    "Missed shot = loose disc (hole)",
  ],
  discSelectionValues: [
    "Distance driver", "Fairway driver",
    "Mid range", "Putter only",
    "Berg only", "Most overstable disc",
    "Most understable disc", "Most stable disc",
    "Highest speed disc", "Lowest speed disc",
    "Mini off the tee", "One disc only (entire hole)",
  ],
  puttingStyleValues: [
    "Turbo put", "Jump putt",
    "Distance driver as putter (highest speed)",
    "Scoober", "Left-hand putt", "Right-hand putt",
  ]
}

export const navStore = reactive({
  currentMode: 0,
  spin: false,
  all: false,
  rotations: defaults.rotations,
  showSettings: false,
  canvasSize: defaults.canvasSize,
  fontSize: defaults.fontSize,
  navBar: false,
  orgShotSelection: defaults.shotSelectionValues,
  orgDiscSelection: defaults.discSelectionValues,
  orgPuttingStyleSelection: defaults.puttingStyleValues,
  resetToDefaults() {
    this.rotations = defaults.rotations;
    this.canvasSize = defaults.canvasSize;
    this.fontSize = defaults.fontSize;
  }
});