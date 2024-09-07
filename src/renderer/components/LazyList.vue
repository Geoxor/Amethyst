<script setup lang="ts">
import { amethyst, useShortcuts } from "@/amethyst";
import BaseChip from "@/components/BaseChip.vue";
import { useContextMenu } from "@/components/ContextMenu";
import Cover from "@/components/CoverArt.vue";
import { AmethystIcon, HeartIcon, SSDIcon } from "@/icons";
import { saveArrayBufferToFile } from "@/logic/dom";
import { convertDfpwm } from "@/logic/encoding";
import { Track } from "@/logic/track";
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
  <div class="text-13px min-h-0 h-full flex flex-col text-left relative select-none">
    <header class="flex text-primary-900 font-bold mb-8 mr-1 justify-between">
      <div class="w-8 min-w-8"/>

      <div class="th title">
        Cover
      </div>

      <div class="w-4 min-w-4"/>

      <div class="th title">
        Title
      </div>

       <div class="w-72 min-w-72"/>

       <div class="th title">
        Location
      </div>

      <div class="w-12 min-w-12"/>

      <div class="th title">
        Album
      </div>

      <div class="w-48 min-w-48"/>

      <div class="th title">
        Year
      </div>

      <div class="w-12 min-w-12"/>

      <div class="th title">
        Duration
      </div>

      <div class="w-12 min-w-12"/>

      <div class="th title">
        Format
      </div>

      <div class="w-12 min-w-12"/>

      <div class="th title">
        Favorite
      </div>

      <div class="w-12 min-w-12"/>

      <div class="th title">
        Bitrate
      </div>

      <div class="w-12 min-w-12"/>

      <div class="th title">
        Size
      </div>

      <div class="w-12 min-w-12"/>

    </header>
    
    <RecycleScroller
      class="h-full w-full"
      :items="tracks"
      :item-size="28"
      key-field="path"
      :buffer="32"
    >
      <template
        #default="{ item }"
      >
        <div
          :class="[
            isHoldingControl && 'control cursor-external-pointer', 
            item.hasErrored && 'opacity-50 not-allowed',
            item.deleted && 'opacity-50 !text-rose-400 not-allowed',

            amethyst.player.getCurrentTrack()?.path == item.path && 'currentlyPlaying',
            useInspector().state.isVisible && useInspector().state.currentItem == item && 'currentlyInspecting'
          ]"
          class="row"
          @contextmenu="handleContextMenu($event, item)"
          @keypress.prevent
          @click="isHoldingControl ? amethyst.showItem(item.path) : amethyst.player.play(item)"
        >
      <div class="w-2 min-w-2"/>

      <div class="td" >
        <loading-icon
          v-if="item.isLoading"
          class="animate-spin h-5 w-5 min-h-5 min-w-5"
        />
            <error-icon
              v-else-if="item.hasErrored"
              class="h-5 w-5 min-h-5 min-w-5"
            />

            <AmethystIcon
              v-else-if="item.deleted"
              class="h-5 w-5 min-h-5 min-w-5"
            />
    
            <cover
              v-else
              class="w-5 h-5 min-h-5 min-w-5"
              :url="(item.isLoaded && item.getCover()) as string"
            />
      </div>


      <div class="td title">
            <span v-if="item.getTitle()" class="w-1">
              {{ item.getTitle() }}
            </span>
            <span v-else class="w-1">
              Not Available
            </span>
          </div>

      <div class="w-24 min-w-24"/>

      <div class="td">
            <span v-if="item.getArtistsFormatted()" class="w-1">
              {{ item.getArtistsFormatted() }}
            </span>
            <span v-else class="w-1">
              Not Available
            </span>
          </div>

      <div class="w-20 min-w-20"/>

      <div class="td">
        <button class="cursor-pointer hover:text-white" @click.stop.prevent="amethyst.showItem(item.path)">
            <SSDIcon class="h-5 w-5 min-h-5 min-w-5"/>
        </button>
      </div>

      <div class="w-8 min-w-8"/>

      <div class="td">
            <span v-if="item.getAlbumFormatted()" class="w-1">
              {{ item.getAlbumFormatted() }}
            </span>
            <span v-else class="w-1">
              Not Available
            </span>
          </div>

      <div class="w-44 min-w-44"/>

      <div class="td">
            <span v-if="item.getMetadata()?.common.year" class="w-1">
              {{ item.getMetadata()?.common.year }}
            </span>
            <span
              v-else class="w-1"
            >
              Not Available
            </span>
      </div>

      <div class="w-8 min-w-8"/>

      <div class="td">
            <span class="w-1">
              {{ item.getDurationFormatted(true) }}
            </span>
      </div>

      <div class="w-8 min-w-8"/>

      <div class="td">
            <span v-if="item.getMetadata()?.format.container" class="w-1">
              {{ item.getMetadata()?.format.container }}
            </span>
            <span
              v-else
              class="w-1"
            >
              Not Available
            </span>
          </div>

      <div class="w-8 min-w-8"/>

      <div
            class="td"
          >
            <HeartIcon
              class="h-4 w-4 min-h-4 min-w-4"
            />
          </div>

      <div class="w-4 min-w-4"/>

      <div class="td">
            <span class="w-1">
              {{ item.getBitrateFormatted() }}
            </span>
          </div>

      <div class="w-4 min-w-4"/>

      <div class="td">
            <span class="w-1">
              {{ item.getFilesizeFormatted() }}
            </span>
      </div>
      <div class="w-16 min-w-16"/>
        </div>
      </template>
    </RecycleScroller>
  </div>
</template>

<style lang="postcss">

.th,
.td {
  @apply text-text_subtitle;

  & strong {
    @apply text-13px text-opacity-50;
  }

  &.title {
    @apply text-text_title text-13px;
  }
}

.td {
  @apply overflow-visible flex items-center font-weight-user-defined text-13px;
}

.row {
  @apply flex justify-between;

  &:hover {
    @apply text-accent;

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

.vue-recycle-scroller__slot {
  @apply flex;
}

.vue-recycle-scroller__slot,
.vue-recycle-scroller__item-view {
  @apply  text-left;
}

.vue-recycle-scroller__slot .th:first-child,
.vue-recycle-scroller__item-view .td:first-child {
  @apply w-4 max-w-4;
}

</style>