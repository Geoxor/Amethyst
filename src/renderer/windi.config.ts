import { defineConfig } from "vite-plugin-windicss";
import typography from "windicss/plugin/typography";

function cssVarRgbHelper(cssVariable: string) {
	return ({ opacityVariable, opacityValue }: { opacityVariable: string; opacityValue: number }) => {
		if (opacityValue !== undefined)
			return `rgba(var(--${cssVariable}), ${opacityValue})`;

		if (opacityVariable !== undefined)
			return `rgba(var(--${cssVariable}), var(${opacityVariable}, 1))`;

		return `rgb(var(--${cssVariable}))`;
	};
}

export default defineConfig({
	darkMode: "class",
	plugins: [typography()],
	alias: {
		fullscreen: "absolute top-0 left-0 w-full h-full",
	},
	theme: {
		extend: {
			colors: {
				primary: {
					1000: cssVarRgbHelper("primary-1000"),
					900: cssVarRgbHelper("primary-900"),
					800: cssVarRgbHelper("primary-800"),
					700: cssVarRgbHelper("primary-700"),
				},
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
