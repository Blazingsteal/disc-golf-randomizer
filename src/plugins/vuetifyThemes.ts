import type {ThemeDefinition} from "vuetify";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    "background": "#eaeaec",
    "surface": '#F1F4F8',
    "surface-variant": '#f9f9fa',
    "on-surface-variant": '#FFFFFF',
    "primary": '#0a5ca9',
    "primary-selected": '#d1d9e1',
    "primary-darken-1": '#063c6f',
    "secondary": '#CBA085',
    "secondary-darken-1": '#B87E5B',
    "error": '#DF062E',
    "info": '#5484c0',
    "success": '#66A446',
    "warning": '#e6da00',
    "option": "#F39C12",

    "primary-light": "#39669d",
    "surface-1": "#F1F4F8",
    "surface-2": "#EBEFF4",
    "surface-3": "#E3E8F0",
    "surface-4": "#DFE5ED",
    "surface-5": "#D7DFE8",

  },
  variables: {
    "border-color": "#000000",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.04,
    "hover-opacity": 0.04,
    "focus-opacity": 0.12,
    "selected-opacity": 0.08,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.12,
    "dragged-opacity": 0.08,
    "kbd-background-color": "#212529",
    "kbd-color": "#FFFFFF",
    "code-background-color": "#C2C2C2"
  }
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    "background": "#1E1F22",
    "surface": "#2B2D30",
    "surface-variant": "#000000",
    "on-surface-variant": "#35373b",
    "primary": "#56A8F5",
    "primary-selected": '#245889',
    "primary-darken-1": "#2690f2",
    "secondary": "#F49810",
    "secondary-darken-1": "#be7609",
    "error": "#DF062E",
    "info": "#5485C0",
    "success": "#66A446",
    "warning": "#D6CE38",
    "option": "#F39C12",

    "primary-light": "#99cbfa",
    "surface-1": "#2B2D30", // HSL(216, 5, 18)
    "surface-2": "#35373b", // HSL(217, 6, 22)
    "surface-3": "#373a3f", // HSL(218, 7, 23)
    "surface-4": "#3b3e45", // HSL(219, 8, 25)
  },
  variables: {
    "border-color": "#FFFFFF",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.1,
    "hover-opacity": 0.04,
    "focus-opacity": 0.12,
    "selected-opacity": 0.08,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.16,
    "dragged-opacity": 0.08,
    "kbd-background-color": "#212529",
    "kbd-color": "#FFFFFF",
    "code-background-color": "#B7B7B7",
  }
}

export {dark, light}
