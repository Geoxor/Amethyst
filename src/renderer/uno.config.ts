import { defineConfig, presetWind3, transformerDirectives } from 'unocss'

function cssVarRgbHelper(cssVariable: string) {
	return ({ opacityVariable, opacityValue }: { opacityVariable: string; opacityValue: number }) => {
		if (opacityValue !== undefined)
			return `rgba(var(--${cssVariable}), ${opacityValue})`;

		if (opacityVariable !== undefined)
			return `rgba(var(--${cssVariable}), var(${opacityVariable}, 1))`;

		return `rgb(var(--${cssVariable}))`;
	};
}

const returnColorVariable = (variableName: string) => ({[variableName]: cssVarRgbHelper(variableName)});

export default defineConfig({
  theme: {
    colors: {
			"textTitle": "#cec7fe",
			"textSubtitle": "#898dc7",
			"primary": "#da74fe",
			"accent": "#868aff",
			"inspectorColor": "#38bdf8",
			"alertColor": "#ff4967",
			"settingsSettingBackground": "#141621",
			"settingsSubsettingBackground": "#101119",
			"playbackControlsBackground": "#181a27",
			"playbackControlsText": "#cec7fe",
			"sliderBackground": "#2d2d49",
			"sliderFill": "#868aff",
			"surface-1000": "#0b0d13",
			"surface-900": "#0f1119",
			"surface-800": "#141621",
			"surface-700": "#181a27",
			"surface-600": "#1f2134",
			"surface-500": "#2d2d49",
			"surface-400": "#383854",
			"primary-1000": "#a3a3d1",
			"primary-900": "#8282a8",
			"primary-800": "#868aff",
			"primary-700": "#646ac3",
			"unlit-900": "#65658a",
			"contrast": "#ffffff"
    },
  },
  presets: [
    presetWind3({
			dark: "class"
		}),
  ],
	transformers: [
    transformerDirectives(),
  ],
})
