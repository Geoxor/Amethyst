import { defineConfig } from "vite-plugin-windicss";
import typography from "windicss/plugin/typography";

const cssVariable = (cssVariable: string) => `var(--color-${cssVariable})`;

const COLORS = [
	"primary",
	"secondary",
	"menu-bar",
	"menu-text",
	"menu-text-hover",
	"menu-background",
	"menu-option-hover",
	"menu-option-text",
	"menu-option-text-hover",
	"menu-splitter",
	"control-minimize-icon",
	"control-minimize-icon-hover",
	"control-minimize-background-hover",
	"control-maximize-icon",
	"control-maximize-icon-hover",
	"control-maximize-background-hover",
	"control-close-icon",
	"control-close-icon-hover",
	"control-close-background-hover",
	"explorer-background",
	"explorer-text",
	"explorer-text-active",
	"explorer-text-hover",
	"meter-background",
	"meter-background-clipping",
	"meter-instantaneous",
	"meter-instantaneous-clipping",
	"meter-average",
	"meter-average-clipping",
	"spectrum-background",
	"spectrum-peaks",
	"tag-background",
	"tag-text",
];

const windiColors: Record<string, string> = {};

for (let i = 0; i < COLORS.length; i++) {
	const color = COLORS[i];
	windiColors[color] = cssVariable(color);
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
 				...windiColors,
			},
		},
	},
});
