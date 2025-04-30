<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import { saveArrayBufferToFile } from "@/logic/dom";
import { convertDfpwm } from "@/logic/encoding";
import type { PossibleSortingMethods } from "@/logic/queue";
import type { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";
import CoverArt from "./CoverArt.vue";
import { useInspector } from "./Inspector";

const currentShortMethod = useLocalStorage<PossibleSortingMethods>("currentShortMethod", "default");
const filterText = useLocalStorage("filterText", "");

const tracks = computed(() => {
  return amethyst.player.queue.getListSorted(currentShortMethod.value, filterText.value);
});

const setCurrentSortedMethod = (sortBy: PossibleSortingMethods) => {
  if (currentShortMethod.value == sortBy) {
    if (amethyst.player.queue.currentSortingDirection.value === "ascending") {
      amethyst.player.queue.currentSortingDirection.value = "descending";
    }
    else if (amethyst.player.queue.currentSortingDirection.value === "descending") {
      amethyst.player.queue.currentSortingDirection.value = "ascending";
      currentShortMethod.value = "default"; // disable sorting
    }
  }
  else {
    currentShortMethod.value = sortBy;
    amethyst.player.queue.currentSortingDirection.value = "ascending";
  }
};

const isHoldingControl = amethyst.shortcuts.isControlPressed;

const ITEM_HEIGHT = amethyst.state.settings.value.compactList ? 32 : 40;

// Context Menu options for this component 
const handleTrackContextMenu = ({x, y}: MouseEvent, track: Track) => {
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

const columns = amethyst.state.settings.value.columns;

const handleColumnContextMenu = ({x, y}: MouseEvent) => {
  useContextMenu().open({x, y}, [
    { title: "Cover", icon: columns.cover ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.cover = !columns.cover },
    { title: "Track №", icon: columns.trackNumber ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.trackNumber = !columns.trackNumber },
    { title: "Title", icon: columns.title ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.title = !columns.title },
    { title: "Artist", icon: columns.artist ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.artist = !columns.artist },
    { title: "Location", icon: columns.location ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.location = !columns.location },
    { title: "Album", icon: columns.album ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.album = !columns.album },
    { title: "Year", icon: columns.year ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.year = !columns.year },
    { title: "Duration", icon: columns.duration ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.duration = !columns.duration },
    { title: "Format", icon: columns.format ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.format = !columns.format },
    { title: "Favorite", icon: columns.favorite ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.favorite = !columns.favorite },
    { title: "Bitrate", icon: columns.bitrate ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.bitrate = !columns.bitrate },
    { title: "Size", icon: columns.size ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.size = !columns.size },
  ]);
};

</script>

<template>
  <div class="text-13px text-text_title min-h-0 h-full flex flex-col text-left relative select-none ">
    <div
      class="flex text-left font-bold sticky top-0 z-10 bg-surface-900 py-2 px-2 columnHeader min-h-36px pr-5"
      :class="[amethyst.player.queue.currentSortingDirection.value]"
      @contextmenu="handleColumnContextMenu($event)"
    >
      <div class="flex-none w-8" />
      <div
        v-if="columns.cover"
        class="flex-none w-[32px]"
      />
      <div
        v-if="columns.trackNumber"
        class="flex-none w-32px"
        :class="[currentShortMethod == 'trackNumber' && 'activeSort']"
        @click="setCurrentSortedMethod('trackNumber')"
      >
        #
        <icon
          v-if="currentShortMethod == 'trackNumber'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.title"
        class="flex-grow w-[200px] w-min-100px"
        :class="[currentShortMethod == 'title' && 'activeSort']"
        @click="setCurrentSortedMethod('title')"
      >
        Title
        <icon
          v-if="currentShortMethod == 'title'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.artist"
        class="flex-grow w-[200px] w-min-100px"
        :class="[currentShortMethod == 'artist' && 'activeSort']"
        @click="setCurrentSortedMethod('artist')"
      >
        Artist
        <icon
          v-if="currentShortMethod == 'artist'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.location"
        class="flex-none w-[70px]"
      >
        Location
      </div>
      <div
        v-if="columns.album"
        class="flex-grow w-[200px] w-min-100px"
        :class="[currentShortMethod == 'album' && 'activeSort']"
        @click="setCurrentSortedMethod('album')"
      >
        Album
        <icon
          v-if="currentShortMethod == 'album'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.year"
        class="flex-none w-[50px]"
        :class="[currentShortMethod == 'year' && 'activeSort']"
        @click="setCurrentSortedMethod('year')"
      >
        Year
        <icon
          v-if="currentShortMethod == 'year'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.duration"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'duration' && 'activeSort']"
        @click="setCurrentSortedMethod('duration')"
      >
        Duration
        <icon
          v-if="currentShortMethod == 'duration'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.format"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'format' && 'activeSort']"
        @click="setCurrentSortedMethod('format')"
      >
        Format
        <icon
          v-if="currentShortMethod == 'format'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.favorite"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'favorite' && 'activeSort']"
        @click="setCurrentSortedMethod('favorite')"
      >
        Favorite
        <icon
          v-if="currentShortMethod == 'favorite'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.bitrate"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'bitrate' && 'activeSort']"
        @click="setCurrentSortedMethod('bitrate')"
      >
        Bitrate
        <icon
          v-if="currentShortMethod == 'bitrate'"
          icon="ic:round-chevron-left"
        />
      </div>
      <div
        v-if="columns.size"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'size' && 'activeSort']"
        @click="setCurrentSortedMethod('size')"
      >
        Size
        <icon
          v-if="currentShortMethod == 'size'"
          icon="ic:round-chevron-left"
        />
      </div>
    </div>

    <RecycleScroller
      class="h-full pb-24 pr-2 leading-tight"
      :items="tracks"
      :item-size="ITEM_HEIGHT"
      key-field="path"
      :buffer="16"
    >
      <template #default="{ item } : { item: Track}">
        <div
          :class="[
            'flex items-center px-2 rounded-4px',
            `h-[${ITEM_HEIGHT}px]`,
            isHoldingControl && 'control cursor-external-pointer',
            item.hasErrored && 'opacity-50 not-allowed',
            item.deleted && 'opacity-50 !text-rose-400 not-allowed',
            amethyst.player.getCurrentTrack()?.path == item.path && 'currentlyPlaying',
            amethyst.state.settings.value.compactList ? 'py-1' : 'py-2',
            useInspector().state.isVisible && useInspector().state.currentItem == item && 'currentlyInspecting',
          ]"
          class="row"
          @contextmenu="handleTrackContextMenu($event, item)"
          @keypress.prevent
          @click="isHoldingControl ? amethyst.showItem(item.path) : amethyst.player.play(item)"
        >
          <div
            class="flex-none w-8"
          >
            <icon
              v-if="amethyst.player.getCurrentTrack()?.path == item.path && amethyst.player.isPlaying.value"
              icon="line-md:play-filled"
              class="w-5 h-5 min-w-5 min-h-5"
            />
            <icon
              v-else-if="amethyst.player.getCurrentTrack()?.path == item.path && !amethyst.player.isPlaying.value"
              icon="line-md:pause"
              class="w-5 h-5 min-w-5 min-h-5"
            />
            <icon
              v-else
              icon="ic:baseline-drag-handle"
              class="w-5 h-5 min-w-5 min-h-5"
            />
          </div>

          <div
            v-if="columns.cover"
            class="flex-none w-[32px]"
          >
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
          <div
            v-if="columns.trackNumber"
            class="flex-none w-32px"
          >
            <span v-if="(item as Track).getMetadata()?.common.track.no">{{ (item as Track).getMetadata()?.common.track.no }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.title"
            class="flex-grow w-[200px] w-min-100px text-text_title "
          >
            <span v-if="item.getTitle()">{{ item.getTitle() }}</span>
            <span v-else-if="item.getFilename()">{{ item.getFilename() }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.artist"
            class="flex-grow w-[200px] w-min-100px"
          >
            <span v-if="item.getArtistsFormatted()">{{ item.getArtistsFormatted() }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.location"
            class="flex-none w-[70px] pl-4"
          >
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

          <div
            v-if="columns.album"
            class="flex-grow w-[200px] w-min-100px "
          >
            <span v-if="item.getAlbumFormatted()">{{ item.getAlbumFormatted() }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.year"
            class="flex-none w-[50px]"
          >
            <span v-if="item.getMetadata()">{{ item.getMetadata()?.common.year }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.duration"
            class="flex-none w-[70px]"
          >
            <span v-if="item.getDurationFormatted(true)">{{ item.getDurationFormatted(true) }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.format"
            class="flex-none w-[70px]"
          >
            <span v-if="item.getMetadata()">{{ item.getMetadata()?.format.container }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.favorite"
            class="flex-none w-[70px] pl-4"
          >
            <icon
              icon="ic:baseline-favorite-border"
              class="h-4 w-4"
            />
          </div>

          <div
            v-if="columns.bitrate"
            class="flex-none w-[70px]"
          >
            <span v-if="item.getBitrateFormatted()">{{ item.getBitrateFormatted() }}</span>
            <span v-else>N/A</span>
          </div>

          <div
            v-if="columns.size"
            class="flex-none w-[70px]"
          >
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

.columnHeader > div {
  @apply flex items-center hover:text-accent;
}

.columnHeader svg {
  @apply w-5 h-5 min-h-5 min-w-5;
}

.columnHeader.ascending svg {
  @apply rotate-90 transform-gpu;
}

.columnHeader.descending svg {
  @apply -rotate-90 transform-gpu;
}

.activeSort {
  @apply text-primary;
}

.row {
  @apply overflow-hidden text-text_subtitle;

  & > div {
  @apply overflow-hidden overflow-ellipsis;
  }

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