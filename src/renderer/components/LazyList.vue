<script setup lang="ts">
import { amethyst, useShortcuts } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import { AmethystIcon } from "@/icons";
import { saveArrayBufferToFile } from "@/logic/dom";
import { convertDfpwm } from "@/logic/encoding";
import { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import CoverArt from "./CoverArt.vue";
import { useInspector } from "./Inspector";

defineProps<{tracks: Track[]}>();

const isHoldingControl = useShortcuts().isControlPressed;

// Context Menu options for this component 
const handleContextMenu = ({x, y}: MouseEvent, track: Track) => {
  useContextMenu().open({x, y}, [
    { title: "Play", icon: AmethystIcon, action: () => amethyst.player.play(track) },
    { title: "Inspect", icon: AmethystIcon, action: () => useInspector().inspectAndShow(track) },
    { title: "Encode to .dfpwm...", icon: AmethystIcon, action: async () => {
      saveArrayBufferToFile(
        await convertDfpwm(await track.getArrayBuffer()), 
        {
          filename: track.getFilenameWithoutExtension(), 
          extension: "dfpwm"
      });
    }},
    { title: "Show in Explorer...", icon: AmethystIcon, action: () => amethyst.showItem(track.path) },
    { title: "Export cover...", icon: AmethystIcon, action: () => track.exportCover() },
    { title: "Reload metadata", icon: AmethystIcon, action: () => track.fetchAsyncData(true) },
    { title: "Remove from queue", icon: AmethystIcon, red: true, action: () => amethyst.player.queue.remove(track) },
    { title: "Delete from disk", icon: AmethystIcon, red: true, action: () => track.delete() },
  ]);
};

</script>

<template>
  <div class="text-13px text-text_title min-h-0 h-full flex flex-col text-left relative select-none">
    <div class="flex text-left font-bold sticky top-0 z-10 bg-surface-900 py-4 px-2">
      <div class="flex-none w-[40px]" />
      <div class="flex-none w-[50px]">
        Cover
      </div>
      <div class="flex-grow w-[300px]">
        Title
      </div>
      <div class="flex-grow w-[200px]">
        Artist
      </div>
      <div class="flex-none w-[70px]">
        Location
      </div>
      <div class="flex-grow w-[200px]">
        Album
      </div>
      <div class="flex-none w-[50px]">
        Year
      </div>
      <div class="flex-none w-[70px]">
        Duration
      </div>
      <div class="flex-none w-[70px]">
        Format
      </div>
      <div class="flex-none w-[70px]">
        Favorite
      </div>
      <div class="flex-none w-[70px]">
        Bitrate
      </div>
      <div class="flex-none w-[70px]">
        Size
      </div>
    </div>

    <RecycleScroller
      class="h-full pb-24"
      :items="tracks"
      :item-size="40"
      key-field="path"
      :buffer="16"
    >
      <template #default="{ item }">
        <div
          :class="[
            'flex items-center py-2 px-2 rounded-8px',
            isHoldingControl && 'control cursor-external-pointer',
            item.hasErrored && 'opacity-50 not-allowed',
            item.deleted && 'opacity-50 !text-rose-400 not-allowed',
            amethyst.player.getCurrentTrack()?.path == item.path && 'currentlyPlaying',
            useInspector().state.isVisible && useInspector().state.currentItem == item && 'currentlyInspecting',
          ]"
          class="row"
          @contextmenu="handleContextMenu($event, item)"
          @keypress.prevent
          @click="isHoldingControl ? amethyst.showItem(item.path) : amethyst.player.play(item)"
        >
          <div class="flex-none w-[40px]">
            <icon
              v-if="amethyst.player.getCurrentTrack()?.path == item.path"
              icon="ic:round-play-arrow"
              class="w-5 h-5 min-w-5 min-h-5"
            />
            <icon
              v-else
              icon="ic:baseline-drag-handle"
              class="w-5 h-5 min-w-5 min-h-5"
            />
          </div>

          <div class="flex-none w-[50px]">
            <icon
              v-if="item.isLoading"
              icon="line-md:loading-twotone-loop"
              class="w-6 h-6 min-w-6 min-h-6 animate-spin"
            />
            <icon
              v-else-if="item.hasErrored"
              icon="ic:twotone-error"
              class="w-6 h-6 min-w-6 min-h-6"
            />
            <icon
              v-else-if="item.deleted"
              icon="ic:twotone-link-off"
              class="w-6 h-6 min-w-6 min-h-6"
            />
            <cover-art
              v-else
              class="w-6 h-6 rounded-md"
              :url="item.isLoaded && item.getCover() ? item.getCover() : ''"
            />
          </div>

          <div class="flex-grow w-[300px] truncate">
            <span v-if="item.getTitle()">{{ item.getTitle() }}</span>
            <span v-else-if="item.getFilename()">{{ item.getFilename() }}</span>
            <span v-else>N/A</span>
          </div>

          <div class="flex-grow w-[200px] truncate">
            <span v-if="item.getArtistsFormatted()">{{ item.getArtistsFormatted() }}</span>
            <span v-else>N/A</span>
          </div>

          <div class="flex-none w-[70px] pl-4">
            <button
              class="cursor-pointer hover:text-white"
              @click.stop.prevent="amethyst.showItem(item.path)"
            >
              <icon
                icon="ic:baseline-folder-open"
                class="h-4 w-4"
              />
            </button>
          </div>

          <div class="flex-grow w-[200px] truncate">
            <span v-if="item.getAlbumFormatted()">{{ item.getAlbumFormatted() }}</span>
            <span v-else>N/A</span>
          </div>

          <div class="flex-none w-[50px]">
            <span v-if="item.getMetadata()">{{ item.getMetadata()?.common.year }}</span>
            <span v-else>N/A</span>
          </div>

          <div class="flex-none w-[70px]">
            <span v-if="item.getDurationFormatted(true)">{{ item.getDurationFormatted(true) }}</span>
            <span v-else>N/A</span>
          </div>

          <div class="flex-none w-[70px]">
            <span v-if="item.getMetadata()">{{ item.getMetadata()?.format.container }}</span>
            <span v-else>N/A</span>
          </div>

          <div class="flex-none w-[70px] pl-4">
            <icon
              icon="ic:baseline-favorite-border"
              class="h-4 w-4"
            />
          </div>

          <div class="flex-none w-[70px]">
            <span v-if="item.getBitrateFormatted()">{{ item.getBitrateFormatted() }}</span>
            <span v-else>N/A</span>
          </div>

          <div class="flex-none w-[70px]">
            <span v-if="item.getFilesizeFormatted()">{{ item.getFilesizeFormatted() }}</span>
            <span v-else>N/A</span>
          </div>
        </div>
      </template>
    </RecycleScroller>
  </div>
</template>

<style lang="postcss">

th {
  @apply sticky top-0 z-10 bg-surface-900 pt-4 pb-4;
}

td {
  @apply pt-2 pb-2;
}

tr {
  @apply rounded-8px overflow-hidden;
}

.row {
  @apply rounded-8px overflow-hidden;

  &:hover {
    @apply text-accent bg-surface-400 bg-opacity-20;
  }

  &.control:hover {
    @apply underline;
  }

  &.currentlyPlaying {
    @apply text-primary bg-primary bg-opacity-10;
    &:hover {
      @apply bg-opacity-15;
    }
  }

  &.currentlyInspecting {
    @apply text-primary bg-primary bg-opacity-10;
    &:hover {
      @apply bg-opacity-15;
    }
  }
}

</style>