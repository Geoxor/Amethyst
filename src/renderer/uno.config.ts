import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import {presetColorsRGB} from 'unocss-preset-colors-rgb'

const cssVar = (string: string) => {
	return `rgba(var(--${string}), <alpha-value>)`
}

export default defineConfig({
	shortcuts: {
		"absolute-xy": "absolute top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2",
		"absolute-x": "absolute left-1/2 transform-gpu -translate-x-1/2",
		"absolute-y": "absolute top-1/2 transform-gpu -translate-y-1/2",
	},
  theme: {
    colors: {
			"textTitle": cssVar('text-title'),
			"textSubtitle": cssVar('text-subtitle'),
			"primary": cssVar('primary'),
			"accent": cssVar('accent'),
			"inspectorColor": cssVar('inspector-color'),
			"alertColor": cssVar('alert-color'),
			"settingsSettingBackground": cssVar('settings-setting-background'),
			"settingsSubsettingBackground": cssVar('settings-subsetting-background'),
			"playbackControlsBackground": cssVar('playback-controls-background'),
			"playbackControlsText": cssVar('playback-controls-text'),
			"sliderBackground": cssVar('slider-background'),
			"sliderFill": cssVar('slider-fill'),
			"surface-1000": cssVar('surface-1000'),
			"surface-900": cssVar('surface-900'),
			"surface-800": cssVar('surface-800'),
			"surface-700": cssVar('surface-700'),
			"surface-600": cssVar('surface-600'),
			"surface-500": cssVar('surface-500'),
			"surface-400": cssVar('surface-400'),
			"primary-1000": cssVar('primary-1000'),
			"primary-900": cssVar('primary-900'),
			"primary-800": cssVar('primary-800'),
			"primary-700": cssVar('primary-700'),
			"unlit-900": cssVar('unlit-900'),
			"contrast": cssVar('contrast')
    },
  },
  presets: [
    presetWind3({
			dark: "class"
		}),
		presetColorsRGB(),
  ],
	transformers: [
    transformerDirectives(),
  ],
})
