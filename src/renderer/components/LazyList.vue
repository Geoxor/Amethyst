<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import { saveArrayBufferToFile } from "@/logic/dom";
import { convertDfpwm } from "@/logic/encoding";
import type { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import CoverArt from "./CoverArt.vue";
import { useInspector } from "./Inspector";

defineProps<{tracks: Track[]}>();

const isHoldingControl = amethyst.shortcuts.isControlPressed;

const ITEM_HEIGHT = amethyst.state.settings.value.compactList ? 32 : 40;

// Context Menu options for this component 
const handleContextMenu = ({x, y}: MouseEvent, track: Track) => {
  useContextMenu().open({x, y}, [
    { title: "Play", icon: "ic:round-play-arrow", action: () => amethyst.player.play(track) },
    { title: "Inspect", icon: "mdi:flask", action: () => useInspector().inspectAndShow(track) },
    { title: "Encode to .dfpwm...", icon: "ic:twotone-qr-code", action: async () => {
      saveArrayBufferToFile(
        await convertDfpwm(await track.getArrayBuffer()), 
        {
          filename: track.getFilenameWithoutExtension(), 
          extension: "dfpwm"
      });
    }},
    { title: "Show in Explorer...", icon: "ic:twotone-pageview", action: () => amethyst.showItem(track.path) },
    { title: "Export cover...", icon: "ic:twotone-add-photo-alternate", action: () => track.exportCover() },
    { title: "Reload metadata", icon: "mdi:flask", action: () => track.fetchAsyncData(true) },
    { title: "Remove from queue", icon: "ic:twotone-delete", red: true, action: () => amethyst.player.queue.remove(track) },
    { title: "Delete from disk", icon: "ic:twotone-delete-forever", red: true, action: () => track.delete() },
  ]);
};

</script>

<template>
  <div class="text-13px text-text_title min-h-0 h-full flex flex-col text-left relative select-none ">
    <div class="flex text-left font-bold sticky top-0 z-10 bg-surface-900 py-4 px-2">
      <div class="flex-none w-8" />
      <div class="flex-none w-[32px]" />
      <div class="flex-grow w-[200px]">
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
      class="h-full pb-24 pr-2 leading-tight"
      :items="tracks"
      :item-size="ITEM_HEIGHT"
      key-field="path"
      :buffer="16"
    >
      <template #default="{ item }">
        <div
          :class="[
            'flex items-center px-2 rounded-4px',
            isHoldingControl && 'control cursor-external-pointer',
            item.hasErrored && 'opacity-50 not-allowed',
            item.deleted && 'opacity-50 !text-rose-400 not-allowed',
            amethyst.player.getCurrentTrack()?.path == item.path && 'currentlyPlaying',
            amethyst.state.settings.value.compactList ? 'py-1' : 'py-2',
            useInspector().state.isVisible && useInspector().state.currentItem == item && 'currentlyInspecting',
          ]"
          class="row"
          @contextmenu="handleContextMenu($event, item)"
          @keypress.prevent
          @click="isHoldingControl ? amethyst.showItem(item.path) : amethyst.player.play(item)"
        >
          <div
            class="flex-none w-8"
          >
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

          <div class="flex-none w-[32px]">
            <icon
              v-if="item.isLoading"
              icon="line-md:loading-twotone-loop"
              class="cover animate-spin"
            />
            <icon
              v-else-if="item.hasErrored"
              icon="ic:twotone-error"
              class="cover"
            />
            <icon
              v-else-if="item.deleted"
              icon="ic:twotone-link-off"
              class="cover"
            />
            <cover-art
              v-else
              class="cover rounded-2px"
              :url="item.isLoaded && item.getCover() ? item.getCover() : ''"
            />
          </div>

          <div class="flex-grow w-[200px] truncate">
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
  @apply sticky top-0 z-10 bg-surface-900 py-4;
}

td {
  @apply py-2;
}

tr {
  @apply overflow-hidden;
}

.cover {
  @apply w-6 h-6 min-w-6 min-h-6;
}

.row {
  @apply overflow-hidden;

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