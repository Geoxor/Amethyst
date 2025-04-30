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
import NotApplicableText from "./NotApplicableText.vue";
import LoadingIcon from "./v2/LoadingIcon.vue";

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
    { title: "queue.column.cover", icon: columns.cover ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.cover = !columns.cover },
    { title: "track.metadata.disk_number", icon: columns.diskNumber ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.diskNumber = !columns.diskNumber },
    { title: "track.metadata.track_number", icon: columns.trackNumber ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.trackNumber = !columns.trackNumber },
    { title: "track.metadata.title", icon: columns.title ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.title = !columns.title },
    { title: "track.file.name", icon: columns.filename ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.filename = !columns.filename },
    { title: "track.metadata.artist", icon: columns.artist ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.artist = !columns.artist },
    { title: "queue.column.location", icon: columns.location ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.location = !columns.location },
    { title: "track.metadata.album", icon: columns.album ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.album = !columns.album },
    { title: "track.metadata.year", icon: columns.year ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.year = !columns.year },
    { title: "track.metadata.duration", icon: columns.duration ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.duration = !columns.duration },
    { title: "track.audio_properties.container", icon: columns.container ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.container = !columns.container },
    { title: "queue.column.favorite", icon: columns.favorite ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.favorite = !columns.favorite },
    { title: "track.audio_properties.bitrate", icon: columns.bitrate ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.bitrate = !columns.bitrate },
    { title: "track.file.size", icon: columns.size ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked", action: () => columns.size = !columns.size },
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
        class="flex-none w-32px transform-gpu -translate-x-1.75"
        :class="[currentShortMethod == 'trackNumber' && 'activeSort']"
        @click="setCurrentSortedMethod('trackNumber')"
      >
        <icon
          icon="material-symbols:tag-rounded"
        />
        <icon
          v-if="currentShortMethod == 'trackNumber'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.diskNumber"
        class="flex-none w-32px transform-gpu -translate-x-1.75"
        :class="[currentShortMethod == 'diskNumber' && 'activeSort']"
        @click="setCurrentSortedMethod('diskNumber')"
      >
        <icon
          icon="mdi:disc"
        />
        <icon
          v-if="currentShortMethod == 'diskNumber'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.filename"
        class="flex-grow w-[200px] w-min-100px"
        :class="[currentShortMethod == 'filename' && 'activeSort']"
        @click="setCurrentSortedMethod('filename')"
      >
        {{ $t('track.file.name') }}
        <icon
          v-if="currentShortMethod == 'filename'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.title"
        class="flex-grow w-[200px] w-min-100px"
        :class="[currentShortMethod == 'title' && 'activeSort']"
        @click="setCurrentSortedMethod('title')"
      >
        {{ $t('track.metadata.title') }}
        <icon
          v-if="currentShortMethod == 'title'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.artist"
        class="flex-grow w-[200px] w-min-100px"
        :class="[currentShortMethod == 'artist' && 'activeSort']"
        @click="setCurrentSortedMethod('artist')"
      >
        {{ $t('track.metadata.artist') }}
        <icon
          v-if="currentShortMethod == 'artist'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.location"
        class="flex-none w-[70px]"
      >
        {{ $t('queue.column.location') }}
      </div>
      <div
        v-if="columns.album"
        class="flex-grow w-[200px] w-min-100px"
        :class="[currentShortMethod == 'album' && 'activeSort']"
        @click="setCurrentSortedMethod('album')"
      >
        {{ $t('track.metadata.album') }}
        <icon
          v-if="currentShortMethod == 'album'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.year"
        class="flex-none w-[50px]"
        :class="[currentShortMethod == 'year' && 'activeSort']"
        @click="setCurrentSortedMethod('year')"
      >
        {{ $t('track.metadata.year') }}
        <icon
          v-if="currentShortMethod == 'year'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.duration"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'duration' && 'activeSort']"
        @click="setCurrentSortedMethod('duration')"
      >
        {{ $t('track.metadata.duration') }}
        <icon
          v-if="currentShortMethod == 'duration'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.container"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'container' && 'activeSort']"
        @click="setCurrentSortedMethod('container')"
      >
        {{ $t('track.audio_properties.container') }}
        <icon
          v-if="currentShortMethod == 'container'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.favorite"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'favorite' && 'activeSort']"
        @click="setCurrentSortedMethod('favorite')"
      >
        {{ $t('queue.column.favorite') }}
        <icon
          v-if="currentShortMethod == 'favorite'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.bitrate"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'bitrate' && 'activeSort']"
        @click="setCurrentSortedMethod('bitrate')"
      >
        {{ $t('track.audio_properties.bitrate') }}
        <icon
          v-if="currentShortMethod == 'bitrate'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.size"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'size' && 'activeSort']"
        @click="setCurrentSortedMethod('size')"
      >
        {{ $t('track.file.size') }}
        <icon
          v-if="currentShortMethod == 'size'"
          icon="ic:round-chevron-left"
          class="chevron"
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
            useInspector().state.isVisible && (useInspector().state.currentItem == item as any) && 'currentlyInspecting',
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
            <loading-icon 
              v-if="item.isLoading"
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
            <span v-if="item.getTrackNumber()">{{ item.getTrackNumber() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.diskNumber"
            class="flex-none w-32px"
          >
            <span v-if="item.getDiskNumber()">{{ item.getDiskNumber() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.filename"
            class="flex-grow w-[200px] w-min-100px"
          >
            <span>{{ item.getFilename() }}</span>
          </div>

          <div
            v-if="columns.title"
            class="flex-grow w-[200px] w-min-100px"
          >
            <span v-if="item.getTitle()">{{ item.getTitle() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.artist"
            class="flex-grow w-[200px] w-min-100px"
          >
            <span v-if="item.getArtistsFormatted()">{{ item.getArtistsFormatted() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.location"
            class="flex-none w-[70px] pl-4"
          >
            <button
              class="cursor-pointer hover:text-text_title"
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
            <span v-if="item.getAlbum()">{{ item.getAlbum() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.year"
            class="flex-none w-[50px]"
          >
            <span v-if="item.getYear()">{{ item.getYear() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.duration"
            class="flex-none w-[70px]"
          >
            <span v-if="item.getDurationFormatted(true)">{{ item.getDurationFormatted(true) }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.container"
            class="flex-none w-[70px]"
          >
            <span v-if="item.getContainer()">{{ item.getContainer() }}</span>
            <not-applicable-text v-else />
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
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.size"
            class="flex-none w-[70px]"
          >
            <span v-if="item.getFilesizeFormatted()">{{ item.getFilesizeFormatted() }}</span>
            <not-applicable-text v-else />
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
  @apply flex items-center relative;

  &:hover:not(.activeSort) {@apply  hover:text-accent; }
}

.columnHeader svg {
  @apply min-h-5 min-w-5;
}

.columnHeader.ascending svg.chevron {
  @apply transform-gpu rotate-90;
}

.columnHeader.descending svg.chevron {
  @apply transform-gpu -rotate-90;
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
    @apply text-light-blue-400 bg-light-blue-400 bg-opacity-10;
    &:hover {
      @apply bg-opacity-15;
    }
  }
}

</style>