<script setup lang="ts">
import { useElectron, useState } from "@/amethyst";
import { CloseIcon } from "@/icons/fluency";
import { AudioFileIcon, ExternalLinkIcon, ImageIcon, ListIcon, PlaystationButtonsIcon, BinocularsIcon } from "@/icons/material";
import ResetIcon from "@/icons/material/ResetIcon.vue";
import { AmethystAudioNode } from "@/logic/audio";
import { Track } from "@/logic/track";
import { bitsToHuman } from "@shared/formating";
import { computed } from "vue";
import { useInspector } from ".";
import BaseChip from "../BaseChip.vue";
import CoverArt from "../CoverArt.vue";
const inspector = useInspector();
const currentItem = computed(() => inspector.state.currentItem);
const state = useState();

const type = (item: any) => {
  if (item instanceof Track) return "track";
  if (item instanceof AmethystAudioNode) return "node";
  return;
};

</script>

<template>
  <div
    :class="state.settings.showSettings ? 'right-66' : 'right-2'"
    class="inspector absolute text-12px top-2 overflow-hidden w-min-64 rounded-4px z-30 text-primary-900 border-1 bg-surface-1000 border-surface-600"
  >
    <div class="h-10 pl-3 flex w-full borderBottom justify-between items-center">
      <div class="flex gap-2 items-center">
        <BinocularsIcon />
        <h1>Inspector</h1>
        <BaseChip>
          {{ type(currentItem) }}
        </BaseChip>
      </div>
      <button
        class="p-3 cursor-pointer hover:text-white"
        @click="inspector.state.isVisible = false"
      >
        <CloseIcon class="w-4 h-4" />
      </button>
    </div>

    <div
      v-if="currentItem instanceof Track && currentItem"
      class="pb-10 h-full overflow-y-auto"
    >
      <section>
        <h1>
          <ListIcon />
          Metadata
        </h1>
        <li>
          <h1>Artist</h1>
          <p> {{ currentItem.getArtistsFormatted() }}</p>
        </li>
        <li>
          <h1>Title</h1>
          <p> {{ currentItem.getTitleFormatted() }}</p>
        </li>
        <li>
          <h1>Album</h1>
          <p> {{ currentItem.getAlbumFormatted() }}</p>
        </li>
        <li>
          <h1>Year</h1>
          <p> {{ currentItem.getMetadata()?.common.year }}</p>
        </li>
        <li>
          <h1>Track Number</h1>
          <p> {{ currentItem.getMetadata()?.common.track.no }}</p>
        </li>
        <li>
          <h1>Total Tracks</h1>
          <p>
            {{ currentItem.getMetadata()?.common.totaltracks 
              || currentItem.getMetadata()?.common.track.of 
              || currentItem.getMetadata()?.common.track.no 
            }}
          </p>
        </li>
        <button @click="currentItem.fetchAsyncData()">
          Refresh metadata
          <ResetIcon />
        </button>
      </section>
      <section>
        <h1>
          <ImageIcon />
          Covers
        </h1>
        <CoverArt
          class="w-16 rounded-4px"
          :url="currentItem.getCover()"
        />
      </section>
      <section>
        <h1 class="">
          <AudioFileIcon />
          File Info
        </h1>

        <li>
          <h1>Filename</h1>
          <p> {{ currentItem.getFilename() }}</p>
        </li>
        <li>
          <h1>Filesize</h1>
          <p> {{ currentItem.getFilesizeFormatted() }}</p>
        </li>
        <button @click="useElectron().ipc.invoke('show-item', [ currentItem.path])">
          Show in explorer
          <ExternalLinkIcon />
        </button>
      </section>
      <section>
        <h1>
          <PlaystationButtonsIcon />
          Audio Properties
        </h1>
        <li>
          <h1>Channels</h1>
          <p> {{ currentItem.getChannels() }}</p>
        </li>
        <li>
          <h1>Duration</h1>
          <p> {{ currentItem.getDurationFormatted() }}</p>
        </li>
        <li>
          <h1>Container</h1>
          <p> {{ currentItem.getMetadata()?.format.container }}</p>
        </li>
        <li>
          <h1>Codec</h1>
          <p> {{ currentItem.getMetadata()?.format.codec }}</p>
        </li>
        <li>
          <h1>Bitrate</h1>
          <p> {{ bitsToHuman(currentItem.getMetadata()?.format.bitrate || 0) }}</p>
        </li>
        <li>
          <h1>Bits</h1>
          <p> {{ currentItem.getMetadata()?.format.bitsPerSample }} bit</p>
        </li>
        <li>
          <h1>Samplerate</h1>
          <p> {{ currentItem.getMetadata()?.format.sampleRate }} Hz</p>
        </li>
      </section>
      <section>
        <h1>
          <PlaystationButtonsIcon />
          State
        </h1>
        <li>
          <h1>Errored</h1>
          <p> {{ currentItem.hasErrored ? "Yes" : "No" }}</p>
        </li>
        <li>
          <h1>Loaded</h1>
          <p> {{ currentItem.isLoaded ? "Yes" : "No" }}</p>
        </li>
        <li>
          <h1>Loading</h1>
          <p> {{ currentItem.isLoading ? "Yes" : "No" }}</p>
        </li>
        <button @click="useElectron().ipc.invoke('show-item', [ currentItem.getCachePath()])">
          Show .amf
          <ExternalLinkIcon />
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.inspector {
  height: calc(100% - 16px);
}

section {
  @apply flex flex-col gap-1 p-2 px-3;
  /* border */
  @apply border-b-1 border-b-surface-600 border-t-transparent border-r-transparent border-l-transparent;

  & button {
    @apply bg-surface-800 items-center flex justify-center gap-2 w-full hover:bg-primary-800 hover:bg-opacity-10 hover:text-primary-800 rounded-4px py-2 px-3;
    cursor: url("./cursors/pointer.png") 4 0, auto !important;
  }

  &:hover {
    @apply bg-surface-800;
    & p {
      @apply bg-surface-600;
    }
    & button:not(:hover) {
      @apply bg-surface-600;
    }
  }

  & li {
    @apply flex justify-between gap-2 items-center;
    & h1 {
      @apply text-primary-1000;
    }
  }
  & > h1 {
    @apply text-primary-800 py-2 flex gap-2 items-center;
  }

  & p {
    @apply px-2 py-1.5 text-7px bg-surface-800 rounded-4px overflow-hidden overflow-ellipsis;
    font-family: "aseprite";
  }
}
</style>