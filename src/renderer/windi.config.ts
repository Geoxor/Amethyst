import { defineConfig } from "vite-plugin-windicss";
import typography from "windicss/plugin/typography";

/**
 * Creates bullshit css variables that support transparency
 * @author Bluskript
 */
const withOpacityValue = (cssVariable: string) => ({ opacityVariable, opacityValue }) => {
	if (opacityValue) {
		if (opacityVariable)
			return `rgba(var(--color-${cssVariable}), var(${opacityVariable}, 1))`;
		return `rgba(var(--color-${cssVariable}), ${opacityValue})`;
	}
	return `rgb(var(--color-${cssVariable}))`;
};

export default defineConfig({
	darkMode: "class",
	plugins: [typography()],
	alias: {
		fullscreen: "absolute top-0 left-0 w-full h-full",
	},
});
