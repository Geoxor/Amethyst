<script setup lang="ts">
import { amethyst } from "@/amethyst";
import SubtitleText from "@/components/v2/SubtitleText.vue";
import TitleText from "@/components/v2/TitleText.vue";

import icon10 from "@/icons/speaker-configurations/1.0-icon.vue";
import icon20 from "@/icons/speaker-configurations/2.0-icon.vue";
import icon40 from "@/icons/speaker-configurations/4.0-icon.vue";
import icon51 from "@/icons/speaker-configurations/5.1-icon.vue";
import icon71 from "@/icons/speaker-configurations/7.1-icon.vue";
import icon716 from "@/icons/speaker-configurations/7.1.6-icon.vue";
import icon916 from "@/icons/speaker-configurations/9.1.6-icon.vue";

import { computed, onMounted, ref } from "vue";

const currentChannels = computed(() => amethyst.player.getCurrentTrack()?.getChannels() || 2);
const currentBits = computed(() => amethyst.player.getCurrentTrack()?.getMetadata()?.format.bitsPerSample || 32);
const currentAudioDevice = computed(() => amethyst.player.outputDevice.value);

const audioLatency = ref(-1);
onMounted(() => {
  amethyst.player.getLatency().then(l => audioLatency.value = l);
});

</script>

<template>
  <div class="flex flex-col gap-3 w-full">
    <title-text :text="$t('output_breakdown.title')" />
    <div class="flex gap-2">
      <div class="layout w-112px h-112px min-w-112px flex items-center justify-center bg-surface-1000 rounded-8px">
        <icon10 v-if="currentChannels == 1" />
        <icon20 v-else-if="currentChannels == 2" />
        <icon40 v-else-if="currentChannels == 4" />
        <icon51 v-else-if="currentChannels == 6" />
        <icon71 v-else-if="currentChannels == 8" />
        <icon716 v-else-if="currentChannels == 14" />
        <icon916 v-else-if="currentChannels == 16" />
      </div>
      <subtitle-text
        class="whitespace-normal max-w-120"
        :text="`Currently outputting ${currentChannels} channels simultaneously at a sample-rate of ${amethyst.player.context.sampleRate/1000}kHz in ${currentBits}bit using device ${currentAudioDevice} with a latency of ${audioLatency.toFixed(1)}ms`"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>