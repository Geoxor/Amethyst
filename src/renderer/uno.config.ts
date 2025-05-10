import { defineConfig } from 'unocss'

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
		extend: {
			colors: {
				// v2
				...returnColorVariable("settings-setting-background"),
				...returnColorVariable("settings-subsetting-background"),
				...returnColorVariable("playback-controls-background"),
				...returnColorVariable("playback-controls-text"),
				...returnColorVariable("slider-background"),
				...returnColorVariable("slider-fill"),
				...returnColorVariable("alert-color"),
				...returnColorVariable("inspector-color"),

				///
				text_title: cssVarRgbHelper("text-title"),
				text_subtitle: cssVarRgbHelper("text-subtitle"),
				accent: cssVarRgbHelper("accent"),
				// TODO: change this to primary when done revamping
				primary: cssVarRgbHelper("primary"),

				// primary: {
				// 	1000: cssVarRgbHelper("primary-1000"),
				// 	900: cssVarRgbHelper("primary-900"),
				// 	800: cssVarRgbHelper("primary-800"),
				// 	700: cssVarRgbHelper("primary-700"),
				// },
				surface: {
					1000: cssVarRgbHelper("surface-1000"),
					900: cssVarRgbHelper("surface-900"),
					800: cssVarRgbHelper("surface-800"),
					700: cssVarRgbHelper("surface-700"),
					600: cssVarRgbHelper("surface-600"),
					500: cssVarRgbHelper("surface-500"),
					400: cssVarRgbHelper("surface-400"),
				},
				unlit: {
					900: cssVarRgbHelper("unlit-900"),
				}
			},
		},
	},
});
