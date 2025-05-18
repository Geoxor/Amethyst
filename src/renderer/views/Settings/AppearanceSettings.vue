<script setup lang="ts">
import { BLEND_MODES, FONT_WEIGHTS } from "@shared/constants.js";

import { amethyst } from "@/amethyst.js";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import DropdownInput from "@/components/v2/DropdownInput.vue";
import SliderInput from "@/components/v2/SliderInput.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { AVAILABLE_THEMES } from "@/logic/settings";
import AmethystDarkSkeleton from "@/themes/AmethystDarkSkeleton.vue";
import EmeraldDarkSkeleton from "@/themes/EmeraldDarkSkeleton.vue";
import OnyxDarkSkeleton from "@/themes/OnyxDarkSkeleton.vue";
import SapphireDarkSkeleton from "@/themes/SapphireDarkSkeleton.vue";

const {appearance} = amethyst.state.settings;
</script>

<template>
  <settings-setting
    :title="$t('settings.animation_duration.title')"
    :description="$t('settings.animation_duration.description')"
    icon="ic:twotone-access-time"
  >
    <slider-input
      v-model="appearance.animationDuration"
      :min="0"
      :max="300"
      :step="10"
      suffix="ms"
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.font_weight.title')"
    :description="$t('settings.font_weight.description')"
    icon="ic:twotone-format-bold"
  >
    <dropdown-input
      v-model="appearance.fontWeight"
      :options="FONT_WEIGHTS"
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.theme.title')"
    :description="$t('settings.theme.description')"
    icon="ic:twotone-palette"
  >
    <dropdown-input
      v-model="appearance.theme"
      :options="AVAILABLE_THEMES"
    />
    <template #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <div class="flex gap-2 px-2">
          <amethyst-dark-skeleton
            class="theme-skeleton cursor-pointer"
            :class="[appearance.theme === 'amethyst-dark' && 'active']"
            @click="appearance.theme = 'amethyst-dark' "
          />
          <emerald-dark-skeleton
            class="theme-skeleton cursor-pointer"
            :class="[appearance.theme === 'emerald-dark' && 'active']"
            @click="appearance.theme = 'emerald-dark'"
          />
          <onyx-dark-skeleton
            class="theme-skeleton cursor-pointer"
            :class="[appearance.theme === 'onyx-dark' && 'active']"
            @click="appearance.theme = 'onyx-dark'"
          />
          <sapphire-dark-skeleton
            class="theme-skeleton cursor-pointer"
            :class="[appearance.theme === 'sapphire-dark' && 'active']"
            @click="appearance.theme = 'sapphire-dark'"
          />
        </div>
        <settings-setting
          subsetting
          :title="$t('settings.cover_based_colors.title')"
          :description="$t('settings.cover_based_colors.description')"
          icon="ic:twotone-palette"
        >
          <toggle-switch
            v-model="appearance.coverBasedColors" 
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.cover_based_icon_colors.title')"
          :description="$t('settings.cover_based_icon_colors.description')"
          icon="ic:twotone-brush"
        >
          <toggle-switch
            v-model="appearance.coverBasedIconColors" 
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>

  <settings-setting
    :title="$t('settings.queue.compact_mode.title')"
    :description="$t('settings.queue.compact_mode.description')"
    icon="ic:twotone-view-list"
  >
    <toggle-switch
      v-model="appearance.compactList" 
    />
  </settings-setting>

  <settings-setting
    :title="$t('settings.ambient_background.title')"
    :description="$t('settings.ambient_background.description')"
    icon="ic:twotone-photo-size-select-actual"
  >
    <toggle-switch
      v-model="appearance.ambientBackground.show" 
    />
    <template
      v-if="appearance.ambientBackground.show"
      #subsettings
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.ambient_background.blending_mode.title')"
          :description="$t('settings.ambient_background.blending_mode.description')"
          icon="ic:twotone-water-drop"
        >
          <dropdown-input
            v-model="appearance.ambientBackground.blendMode"
            :options="BLEND_MODES"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.ambient_background.spin.title')"
          :description="$t('settings.ambient_background.spin.description')"
          icon="ic:twotone-rotate-90-degrees-ccw"
        >
          <toggle-switch
            v-model="appearance.ambientBackground.spin" 
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.ambient_background.spin_speed.title')"
          :description="$t('settings.ambient_background.spin_speed.description')"
          icon="ic:twotone-rotate-90-degrees-ccw"
        >
          <slider-input
            v-model="appearance.ambientBackground.spinSpeed"
            :min="0"
            :max="60"
            :step="1"
            suffix="sec/spin"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.ambient_background.opacity.title')"
          :description="$t('settings.ambient_background.opacity.description')"
          icon="ic:twotone-opacity"
        >
          <slider-input
            v-model="appearance.ambientBackground.opacity"
            :min="0"
            :max="50"
            :step="2.5"
            suffix="%"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.ambient_background.blur_strength.title')"
          :description="$t('settings.ambient_background.blur_strength.description')"
          icon="ic:twotone-blur-linear"
        >
          <slider-input
            v-model="appearance.ambientBackground.blurStrength"
            :min="0"
            :max="128"
            :step="4"
            suffix="px"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t('settings.ambient_background.zoom.title')"
          :description="$t('settings.ambient_background.zoom.description')"
          icon="ic:twotone-zoom-in"
        >
          <slider-input
            v-model="appearance.ambientBackground.zoom"
            :min="50"
            :max="250"
            :step="10"
            suffix="%"
          />
        </settings-setting>
        <settings-setting
          subsetting
          :title="$t(`settings.ambient_background.shader.title`)"
          :description="$t('settings.ambient_background.shader.description')"
          icon="ic:twotone-auto-awesome"
        >
          <toggle-switch v-model="appearance.shader.use" />
          <!-- TODO: Shader options built-in and in amethyst user-config shader directory -->
          <dropdown-input
            v-model="appearance.shader.selected"
            :options="amethyst.state.shaders.value.getShaderNames()"
          />
        </settings-setting>
      </div>
    </template> 
  </settings-setting>
  <settings-setting
    :title="$t('settings.neon_mode.title')"
    :description="$t('settings.neon_mode.description')"
    icon="ic:twotone-remove-red-eye"
  >
    <toggle-switch
      v-model="appearance.neonMode" 
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.playback_controls.title')"
    info="https://amethyst.geoxor.moe/user-manual/ui/playback-controls"
    :shortcuts="['F10']"
    :description="$t('settings.playback_controls.description')"
    icon="ic:twotone-skip-next"
  >
    <toggle-switch
      v-model="appearance.showPlaybackControls" 
    />
  </settings-setting>
  <settings-setting
    :title="$t('settings.minimalist_mode.title')"
    :description="$t('settings.minimalist_mode.description')"
    icon="ic:twotone-remove-red-eye"
  >
    <toggle-switch
      v-model="appearance.minimalistMode" 
    />
    <template
      v-if="appearance.minimalistMode"
      #subsettings 
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          subsetting
          :title="$t('settings.minimalist_mode.hide_category_titles.title')"
          :description="$t('settings.minimalist_mode.hide_category_titles.description')"
          icon="ic:twotone-format-strikethrough"
        >
          <toggle-switch
            v-model="appearance.hideCategoryTitles" 
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
  
  <settings-setting
    :title="$t('settings.cover_art.title')"
    :description="$t('settings.cover_art.description')"
    icon="ic:twotone-image"
  >
    <toggle-switch
      v-model="appearance.showCoverArt" 
    />
  </settings-setting>
  <settings-setting
    :shortcuts="['F9']"
    :title="$t('settings.debug_stats.title')"
    :description="$t('settings.debug_stats.description')"
    icon="ic:twotone-bug-report"
  >
    <toggle-switch
      v-model="appearance.showDebugStats" 
    />
  </settings-setting>
</template>

<style scoped lang="postcss">
.theme-skeleton {
  @apply border-solid border-2 border-transparent box-content rounded-8px w-32 h-auto lg:w-min;

  &:hover {
    @apply border-surface-400;
  }

  &.active {
    @apply border-accent;
  }
}
</style>