<script setup lang="ts">
import { amethyst } from "@/amethyst";
import LoadingIcon from "@/components/v2/LoadingIcon.vue";
import { AmethystAudioNode } from "@/logic/audio";
import { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import { bytesToHuman } from "@shared/formating";
import { removeEmptyObjects } from "@shared/logic";
import { computed, onMounted, onUnmounted } from "vue";
import { useInspector } from ".";
import BaseChip from "../BaseChip.vue";
import { useContextMenu } from "../ContextMenu";
import CoverArt from "../CoverArt.vue";

const getInspectableItemType = (item: Track | AmethystAudioNode) => {
  if (item instanceof Track) return "inspector.inspecting_item_type.track";
  if (item instanceof AmethystAudioNode) return "inspector.inspecting_item_type.node";
  return "inspector.inspecting_item_type.unknown";
};

const inspector = useInspector();
const handlePlay = (track: Track) => {
  inspector.inspect(track);
};

onMounted(() => {
  amethyst.player.on("play", handlePlay);
  const currentTrack = amethyst.player.getCurrentTrack();
  if (!currentTrack) return;
  if (!inspector.state.currentItem) inspector.inspect(currentTrack);
});

onUnmounted(() => {
  amethyst.player.off("play", handlePlay);
});

function cloneWithoutPicture(obj: Record<string, any>): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { picture, ...rest } = obj;
  return { ...rest };
}

const filteredMetadata = computed(() => {
  const metadata = inspector.state.currentItem?.getMetadata()?.common;
  if (!metadata) return {};
  return removeEmptyObjects(cloneWithoutPicture(metadata));
});

</script>

<template>
  <div
    class="inspector absolute text-12px top-16 right-2 overflow-hidden w-min-96 rounded-4px z-30 text-primary-900 border-1 border-surface-600 bg-surface-1000"
  >
    <div class="h-10 pl-3 flex w-full  justify-between items-center ">
      <div class="flex gap-2 items-center text-light-blue-400">
        <icon
          icon="mdi:flask"
          class="h-5-w-5 min-w-5 min-h-5"
        />
        <h1>{{ $t('inspector.title') }}</h1>
        <base-chip color="light-blue-400">
          {{ $t(getInspectableItemType(inspector.state.currentItem as any as Track)) }}
        </base-chip>
      </div>
      <button
        class="p-3 cursor-pointer hover:text-text_title"
        @click="inspector.hide()"
      >
        <icon
          icon="ic:twotone-close"
          class="utilityButton absolute top-3 right-3 cursor-pointer"
        />
      </button>
    </div>

    <div
      v-if="inspector.state.currentItem instanceof Track && inspector.state.currentItem"
      class="pb-10 h-full overflow-y-auto"
    >
      <section covers>
        <h1>
          <icon
            icon="ic:twotone-image"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('track.covers') }}
          <loading-icon
            v-if="!inspector.state.currentItem.isLoaded"
            class="h-3 animate-spin w-3 min-h-3 min-w-3"
          />
        </h1>
        <!-- FIXME: Cover art data will sometimes not show, even though metadata is loaded https://files.catbox.moe/jusams.png -->
        <div
          v-for="(picture, i) of inspector.state.currentItem.getMetadata()?.common.picture"
          :key="picture.data.byteLength"
          class="flex flex-col gap-2 py-1 last:border-none"
        >
          <cover-art 
            class="w-auto h-full rounded-4px"
            :url="inspector.state.currentItem.getCoverByFace(i)"
            @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
              { title: 'Export cover...', icon: 'ic:twotone-add-photo-alternate', action: () => inspector.state.currentItem.exportCover(i) },
            ]);"
          />
          <div class="flex flex-col gap-1 w-full">
            <li class="flex justify-between gap-2">
              <h1>{{ $t('track.metadata.cover.face') }}</h1>
              <p>
                {{ picture.type === "Media (e.g. label side of CD)" ? 'Disc' : picture.type }}
              </p>
            </li>
            <li class="flex justify-between gap-2">
              <h1>{{ $t('track.metadata.cover.format') }}</h1>
              <p> {{ picture.format }} </p>
            </li>
            <li class="flex justify-between gap-2">
              <h1>{{ $t('track.metadata.cover.size') }}</h1>
              <p> {{ bytesToHuman(picture.data.byteLength || 0) }} </p>
            </li>
          </div>
        </div>
      </section>

      <section metadata>
        <h1>
          <icon
            icon="ic:twotone-text-snippet"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('track.metadata') }}
          <loading-icon
            v-if="!inspector.state.currentItem.isLoaded"
          />
        </h1>

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
        <button
          class="cursor-pointer"
          @click="inspector.state.currentItem.fetchAsyncData(true)"
        >
          {{ $t('track.metadata.refresh') }}
        </button>
      </section>
      
      <section audio-properties>
        <h1>
          <icon
            icon="ic:twotone-document-scanner"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('track.audio_properties') }}
        </h1>
        <li>
          <h1>{{ $t('track.audio_properties.channels') }}</h1>
          <p> {{ inspector.state.currentItem.getChannels() }}</p>
        </li>
        <li>
          <h1>{{ $t('track.audio_properties.duration') }}</h1>
          <p> {{ inspector.state.currentItem.getDurationFormatted() }}</p>
        </li>
        <li>
          <h1>{{ $t('track.audio_properties.container') }}</h1>
          <p> {{ inspector.state.currentItem.getContainer() }}</p>
        </li>
        <li>
          <h1>{{ $t('track.audio_properties.codec') }}</h1>
          <p> {{ inspector.state.currentItem.getCodec() }}</p>
        </li>
        <li>
          <h1>{{ $t('track.audio_properties.bitrate') }}</h1>
          <p> {{ (((inspector.state.currentItem.getBitrate()) || 0) / 1000).toFixed(2) }} Kbps</p>
        </li>
        <li>
          <h1>{{ $t('track.audio_properties.bits_per_sample') }}</h1>
          <p> {{ inspector.state.currentItem.getBitsPerSample() }} bit</p>
        </li>
        <li>
          <h1>{{ $t('track.audio_properties.sample_rate') }}</h1>
          <p> {{ inspector.state.currentItem.getSampleRate() }} Hz</p>
        </li>
      </section>
      
      <section file-information>
        <h1 class="">
          <icon
            icon="ic:twotone-insert-drive-file"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('track.file_information') }}
        </h1>

        <li>
          <h1>{{ $t('track.file.name') }}</h1>
          <p> {{ inspector.state.currentItem.getFilename() }}</p>
        </li>
        <li>
          <h1>{{ $t('track.file.size') }}</h1>
          <p> {{ inspector.state.currentItem.getFilesizeFormatted() }}</p>
        </li>
        <button
          class="cursor-pointer"
          @click="amethyst.showItem(inspector.state.currentItem.path)"
        >
          {{ $t('track.show_file_in_file_explorer') }}
          <icon
            icon="ic:twotone-open-in-new"
            class="h-5-w-5 min-w-5 min-h-5"
          />
        </button>
      </section>
      
      <section state>
        <h1>
          <icon
            icon="ic:twotone-circle"
            class="h-5-w-5 min-w-5 min-h-5"
          />
          {{ $t('track.state') }}
        </h1>
        <li>
          <h1>{{ $t('track.state.errored') }}</h1>
          <p> {{ inspector.state.currentItem.hasErrored ? "Yes" : "No" }}</p>
        </li>
        <li>
          <h1>{{ $t('track.state.loaded') }}</h1>
          <p> {{ inspector.state.currentItem.isLoaded ? "Yes" : "No" }}</p>
        </li>
        <li>
          <h1>{{ $t('track.state.loading') }}</h1>
          <p> {{ inspector.state.currentItem.isLoading ? "Yes" : "No" }}</p>
        </li>
        <button
          class="cursor-pointer"
          @click="amethyst.showItem(inspector.state.currentItem.getCachePath())"
        >
          {{ $t('track.show_amf_in_file_explorer') }}
          <icon
            icon="ic:twotone-open-in-new"
            class="h-5-w-5 min-w-5 min-h-5"
          />
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.inspector {
  height: calc(100% - 80px);
  @apply text-text_title text-12px;
}

section {
  @apply flex flex-col gap-1 p-3;
  /* border */
  @apply border-b-1 border-b-surface-600 border-t-transparent border-r-transparent border-l-transparent;

  & button {
    @apply bg-surface-800 mt-2 items-center flex justify-center gap-2 w-full hover:bg-purple-400 hover:bg-opacity-10 hover:text-purple-400 rounded-4px py-1.5;
  }

  &:hover {
    @apply bg-surface-800;
    & input,
    & p {
      @apply bg-surface-600;
    }
    & button:not(:hover) {
      @apply bg-surface-600;
    }
  }

  & li {
    @apply flex justify-between gap-2 items-center w-full;
  }
  & > h1 {
    @apply text-purple-400 pb-2 flex gap-2 items-center whitespace-pre;
  }

  & input,
  & p {
    @apply px-2 py-1 bg-surface-800 rounded-4px overflow-hidden overflow-ellipsis;
  }

  input {
    @apply border-1 border-transparent w-1/2;
    &:hover {
      @apply bg-purple-400 bg-opacity-25 text-text_title;
    }
    &:focus {
      @apply bg-purple-400 bg-opacity-25 border-1 border-purple-400 text-text_title;
    }
  }
}

</style>