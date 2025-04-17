<script setup lang="ts">
import { amethyst, useShortcuts } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import Cover from "@/components/CoverArt.vue";
import { AmethystIcon } from "@/icons";
import { saveArrayBufferToFile } from "@/logic/dom";
import { convertDfpwm } from "@/logic/encoding";
import { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
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
    <div class="overflow-y-auto">
      <div class="flex text-left font-bold sticky top-0 z-10 bg-surface-900 py-4 px-2">
        <div class="flex-none w-[40px]"></div>
        <div class="flex-none w-[50px]">Cover</div>
        <div class="flex-grow w-[300px]">Title</div>
        <div class="flex-grow w-[200px]">Artist</div>
        <div class="flex-none w-[70px]">Location</div>
        <div class="flex-grow w-[200px]">Album</div>
        <div class="flex-none w-[50px]">Year</div>
        <div class="flex-none w-[70px]">Duration</div>
        <div class="flex-none w-[70px]">Format</div>
        <div class="flex-none w-[70px]">Favorite</div>
        <div class="flex-none w-[70px]">Bitrate</div>
        <div class="flex-none w-[70px]">Size</div>
      </div>

    <RecycleScroller
      :items="tracks"
      :item-size="40"
      key-field="path"
      :buffer="32"
      v-slot="{ item }"
    >
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
          <div 
            v-if="amethyst.player.getCurrentTrack()?.path == item.path"
            class="h-5 w-5"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.109 10.336L9.109 4.336C8.775 4.113 8.388 4 8 4C7.676 4 7.352 4.078 7.056 4.237C6.406 4.585 6 5.262 6 6V18C6 18.738 6.406 19.415 7.056 19.763C7.352 19.922 7.676 20 8 20C8.388 20 8.775 19.887 9.11 19.664L18.11 13.664C18.666 13.293 19 12.669 19 12C19 11.331 18.666 10.707 18.109 10.336Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div 
            v-else
            class="h-5 w-5"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.7557 4.14262L10.5173 1.88262C10.2323 1.59512 9.76817 1.59512 9.48317 1.88262L7.244 4.14262C6.92984 4.46012 7.15484 5.00012 7.60234 5.00012H12.3982C12.8448 5.00012 13.0698 4.46012 12.7557 4.14262Z" fill="#66699B"/>
              <path d="M7.244 15.8575L9.48234 18.1175C9.76734 18.405 10.2315 18.405 10.5165 18.1175L12.7548 15.8575C13.0698 15.54 12.8448 15 12.3973 15H7.60234C7.15484 15 6.92984 15.54 7.244 15.8575Z" fill="#66699B"/>
              <path opacity="0.35" d="M16.25 10.8335H3.75C3.06 10.8335 2.5 11.3935 2.5 12.0835C2.5 12.7735 3.06 13.3335 3.75 13.3335H16.25C16.94 13.3335 17.5 12.7735 17.5 12.0835C17.5 11.3935 16.94 10.8335 16.25 10.8335Z" fill="#66699B"/>
              <path opacity="0.35" d="M16.25 6.6665H3.75C3.06 6.6665 2.5 7.2265 2.5 7.9165C2.5 8.6065 3.06 9.1665 3.75 9.1665H16.25C16.94 9.1665 17.5 8.6065 17.5 7.9165C17.5 7.2265 16.94 6.6665 16.25 6.6665Z" fill="#66699B"/>
            </svg>
          </div>
        </div>

        <div class="flex-none w-[50px]">
          <AmethystIcon
            v-if="item.isLoading || item.deleted || item.hasErrored"
            class="h-6 w-6 rounded-md"
          />
          <cover
            v-else
            class="w-6 h-6 rounded-md"
            :url="(item.isLoaded && item.getCover()) as string"
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
            <Icon icon="ic:twotone-folder-open" class="h-4 w-4" />
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
          <Icon icon="ic:twotone-favorite" class="h-4 w-4" />
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
    </RecycleScroller>
    </div>
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