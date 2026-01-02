<script setup lang="ts">
import { Track } from "@/logic/track";
import { bytesToHuman } from "@shared/formating";
import { useContextMenu } from "../ContextMenu";
import { amethyst } from "@/amethyst.js";
import { computed } from "vue";
import { removeEmptyObjects } from "@shared/logic.js";
import CoverArt from "../CoverArt.vue";
import InspectorItem from "./InspectorItem.vue";
import InspectorSection from "./InspectorSection.vue";
import InspectorButton from "./InspectorButton.vue";
const props = defineProps<{ track: Track }>();

const filteredMetadata = computed(() => {
  const metadata = props.track.getMetadata()?.common;
  if (!metadata) return {};
  return removeEmptyObjects(cloneWithoutPicture(metadata));
});

function cloneWithoutPicture(obj: Record<string, any>): Record<string, any> {
  const { picture, ...rest } = obj;
  return { ...rest };
}

</script>

<template>
  <div class="pb-42 h-full overflow-y-auto">
    <inspector-section title="track.covers" icon="ic:twotone-image">
      <!-- FIXME: Cover art data will sometimes not show, even though metadata is loaded https://files.catbox.moe/jusams.png -->
      <div
        v-for="(picture, i) of track.getMetadata()?.common.picture"
        :key="picture.data.byteLength"
        class="flex flex-col gap-2 py-1 last:border-none"
      >
        <cover-art
          class="w-auto h-full rounded-4px"
          :url="track.getCoverByFace(i)"
          @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
            { title: 'Export cover...', icon: 'ic:twotone-add-photo-alternate', action: () => track?.exportCover(i) },
          ]);"
        />
        <div class="flex flex-col gap-1 w-full">
          <inspector-item name="track.metadata.cover.face" :value="picture.type === 'Media (e.g. label side of CD)' ? 'Disc' : picture.type" />
          <inspector-item name="track.metadata.cover.dimensions" :value="picture.width + 'x' + picture.height" />
          <inspector-item name="track.metadata.cover.format" :value="picture.format" />
          <inspector-item name="track.metadata.cover.size" :value="bytesToHuman(picture.data.byteLength || 0)" />
        </div>
      </div>
    </inspector-section>

    <inspector-section title="track.metadata" icon="ic:twotone-text-snippet">
      <li
        v-for="(value, key) in filteredMetadata"
        :key="key"
      >
        <template v-if="value.constructor === Object">
          <div class="flex flex-col gap-1 justify-between w-full">
            <li
              v-for="(b, j) in value"
              :key="j"
            >
              <h1>{{ key }} {{ j }}</h1>
              <input :value="b">
            </li>
          </div>
        </template>
        <template v-else>
          <h1>{{ key }}</h1>
          <input :value="value">
        </template>
      </li>
      <inspector-button
        name="track.metadata.refresh"
        icon="ic:twotone-refresh"
        @click="track.fetchAsyncData(true)"
      />
    </inspector-section>

    <inspector-section title="track.analytics" icon="ic:twotone-bar-chart">
      <inspector-item name="track.analytics.play_count" :value="amethyst.analytics.getAnalytics(track).playCount" />
      <inspector-item name="track.analytics.skip_count" :value="amethyst.analytics.getAnalytics(track).skipCount" />
      <inspector-item name="track.analytics.date_added" :value="new Date(amethyst.analytics.getAnalytics(track).dateAdded).toLocaleDateString()" />
    </inspector-section>

    <inspector-section title="track.audio_properties" icon="ic:twotone-document-scanner">
      <inspector-item name="track.audio_properties.duration" :value="track.getChannels()" />
      <inspector-item name="track.audio_properties.duration" :value="track.getDurationFormatted()" />
      <inspector-item name="track.audio_properties.container" :value="track.getContainer()" />
      <inspector-item name="track.audio_properties.codec" :value="track.getCodec()" />
      <inspector-item name="track.audio_properties.bitrate" :value="(((track.getBitrate()) || 0) / 1000).toFixed(2) + ' Kbps'" />
      <inspector-item name="track.audio_properties.bits_per_sample" :value="track.getBitsPerSample() + ' bit'" />
      <inspector-item name="track.audio_properties.sample_rate" :value="track.getSampleRate() + ' Hz'" />
    </inspector-section>

    <inspector-section title="track.file_information" icon="ic:twotone-insert-drive-file">
      <inspector-item name="track.file.name" :value="track.getFilename()" />
      <inspector-item name="track.file.size" :value="track.getFilesizeFormatted()" />
      <inspector-item name="track.file.hash" :value="track.uuid" />
      <inspector-button
        name="track.show_file_in_file_explorer"
        icon="ic:twotone-open-in-new"
        @click="amethyst.showItem(track.path)"
      />
    </inspector-section>

    <inspector-section title="track.state" icon="ic:twotone-circle">
      <inspector-item name="track.file.name" :value="track.hasErrored ? 'Yes' : 'No'" />
      <inspector-item name="track.file.size" :value="track.isLoaded ? 'Yes' : 'No'" />
      <inspector-item name="track.file.hash" :value="track.isLoading ? 'Yes' : 'No'" />
      <inspector-button
        name="track.show_amf_in_file_explorer"
        icon="ic:twotone-open-in-new"
        @click="amethyst.showItem(track.getCachePath(true))"
      />
    </inspector-section>
  </div>
</template>
