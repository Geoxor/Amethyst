<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

import { amethyst } from "@/amethyst.js";
import { useContextMenu } from "@/components/ContextMenu";
import type { PossibleSortingMethods } from "@/logic/queue";
import { type Track,trackContextMenuOptions } from "@/logic/track";
import type { IContextMenuOption } from "@/state";

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

const ITEM_HEIGHT = amethyst.state.settings.appearance.compactList ? 32 : 40;

// Context Menu options for this component 
const handleTrackContextMenu = ({x, y}: MouseEvent, track: Track) => {
  useContextMenu().open({x, y}, trackContextMenuOptions(track));
};

const columns = amethyst.state.settings.columns;

const handleColumnContextMenu = ({ x, y }: MouseEvent) => {
  const contextMenu = useContextMenu();

  const columnOptions: {key: keyof typeof amethyst.state.settings.columns, title: string}[] = [
    { key: "cover", title: "queue.column.cover" },
    { key: "diskNumber", title: "track.metadata.disk_number" },
    { key: "trackNumber", title: "track.metadata.track_number" },
    { key: "filename", title: "track.file.name" },
    { key: "title", title: "track.metadata.title" },
    { key: "artist", title: "track.metadata.artist" },
    { key: "location", title: "queue.column.location" },
    { key: "album", title: "track.metadata.album" },
    { key: "genre", title: "track.metadata.genre"},
    { key: "barcode", title: "track.metadata.barcode"},
    { key: "year", title: "track.metadata.year" },
    { key: "label", title: "track.metadata.label"},
    { key: "isrc", title: "track.metadata.isrc"},
    { key: "copyright", title: "track.metadata.copyright"},
    { key: "bpm", title: "track.metadata.bpm"},
    { key: "duration", title: "track.metadata.duration" },
    { key: "container", title: "track.audio_properties.container" },
    { key: "favorite", title: "queue.column.favorite" },
    { key: "sampleRate", title: "track.audio_properties.sample_rate" },
    { key: "bitsPerSample", title: "track.audio_properties.bits_per_sample" },
    { key: "bitrate", title: "track.audio_properties.bitrate" },
    { key: "size", title: "track.file.size" },
  ];

  const menuItems: IContextMenuOption[] = columnOptions.map(({ key, title }) => ({
    title,
    icon: columns[key] ? "ic:twotone-radio-button-checked" : "ic:twotone-radio-button-unchecked",
    action: () => columns[key] = !columns[key],
  }));

  contextMenu.open({ x, y }, menuItems);
};

const handleTrackDragStart = (e: DragEvent, path: Track) => {
  window.electron.startDrag(path.absolutePath);
  (e.target as HTMLDivElement).classList.add("dragging");
};

</script>

<template>
  <div class="text-13px text-text-title min-h-0 flex flex-col text-left relative select-none "
    :class="[amethyst.getCurrentPlatform() == 'mobile' && 'h-[calc(100%-228px)]']">
    <div
      class="flex text-left font-weight-user-defined sticky top-0 z-10 bg-surface-900 py-2 px-2 columnHeader min-h-36px"
      :class="[amethyst.player.queue.currentSortingDirection.value]"
      @contextmenu="handleColumnContextMenu($event)"
    >
      <div class="flex-none w-8" />
      <div
        v-if="columns.cover"
        class="flex-none w-[32px] "
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
        class="flex-none w-[70px] w-min-100px "
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
        v-if="columns.genre"
        class="flex-grow w-[120px]"
        :class="[currentShortMethod == 'genre' && 'activeSort']"
        @click="setCurrentSortedMethod('genre')"
      >
        {{ $t('track.metadata.genre') }}
        <icon
          v-if="currentShortMethod == 'genre'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>

      <div
        v-if="columns.barcode"
        class="flex-grow w-[120px]"
        :class="[currentShortMethod == 'barcode' && 'activeSort']"
        @click="setCurrentSortedMethod('barcode')"
      >
        {{ $t('track.metadata.barcode') }}
        <icon
          v-if="currentShortMethod == 'barcode'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>

      <div
        v-if="columns.label"
        class="flex-grow w-[100px]"
        :class="[currentShortMethod == 'label' && 'activeSort']"
        @click="setCurrentSortedMethod('label')"
      >
        {{ $t('track.metadata.label') }}
        <icon
          v-if="currentShortMethod == 'label'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>

      <div
        v-if="columns.isrc"
        class="flex-grow w-[110px]"
        :class="[currentShortMethod == 'isrc' && 'activeSort']"
        @click="setCurrentSortedMethod('isrc')"
      >
        {{ $t('track.metadata.isrc') }}
        <icon
          v-if="currentShortMethod == 'isrc'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>

      <div
        v-if="columns.copyright"
        class="flex-grow w-[100px]"
        :class="[currentShortMethod == 'copyright' && 'activeSort']"
        @click="setCurrentSortedMethod('copyright')"
      >
        {{ $t('track.metadata.copyright') }}
        <icon
          v-if="currentShortMethod == 'copyright'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>

      <div
        v-if="columns.bpm"
        class="flex-none w-[60px]"
        :class="[currentShortMethod == 'bpm' && 'activeSort']"
        @click="setCurrentSortedMethod('bpm')"
      >
        {{ $t('track.metadata.bpm') }}
        <icon
          v-if="currentShortMethod == 'bpm'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>

      <div
        v-if="columns.duration"
        class="flex-none w-[80px]"
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
        class="flex-none w-[80px]"
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
        v-if="columns.sampleRate"
        class="flex-none w-[100px]"
        :class="[currentShortMethod == 'sampleRate' && 'activeSort']"
        @click="setCurrentSortedMethod('sampleRate')"
      >
        {{ $t('track.audio_properties.sample_rate') }}
        <icon
          v-if="currentShortMethod == 'sampleRate'"
          icon="ic:round-chevron-left"
          class="chevron"
        />
      </div>
      <div
        v-if="columns.bitsPerSample"
        class="flex-none w-[70px]"
        :class="[currentShortMethod == 'bitsPerSample' && 'activeSort']"
        @click="setCurrentSortedMethod('bitsPerSample')"
      >
        {{ $t('track.audio_properties.bits_per_sample') }}
        <icon
          v-if="currentShortMethod == 'bitsPerSample'"
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
      class="h-full w-full pb-32 leading-tight"
      :items="tracks"
      :item-size="ITEM_HEIGHT"
      key-field="path"
      :buffer="24"
      :class="[amethyst.getCurrentPlatform() != 'mobile' && 'pb-32']"
    >
      <template #default="{ item } : { item: Track}">
        <div
          class="row flex items-center px-2 rounded-4px font-weight-user-defined"
          :class="[
            `max-h-[${ITEM_HEIGHT}px] h-[${ITEM_HEIGHT}px]`,
            isHoldingControl && 'control cursor-external-pointer',
            item.hasErrored && 'opacity-50 not-allowed',
            item.deleted && 'opacity-50 !text-rose-400 not-allowed',
            amethyst.player.getCurrentTrack()?.path == item.path && 'currentlyPlaying',
            amethyst.state.settings.appearance.compactList ? 'py-1' : 'py-2',
            useInspector().state.isVisible && (useInspector().state.currentItem == item as any) && 'currentlyInspecting',
          ]"
          draggable="true"
          @contextmenu="handleTrackContextMenu($event, item)"
          @dragstart.prevent="handleTrackDragStart($event, item)"
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
              v-else-if="useInspector().state.currentItem?.path == item.path"
              icon="mdi:flask"
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
            class="flex-none w-[32px] h-[24px]"
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
            <icon
              icon="ic:baseline-folder-open"
              class="h-4 w-4 cursor-pointer hover:text-text-title"
              @click.stop.prevent="amethyst.showItem(item.path)"
            />
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
            v-if="columns.genre"
            class="flex-grow w-[120px]"
          >
            <span v-if="item.getGenre()">{{ item.getGenreFormatted() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.barcode"
            class="flex-grow w-[120px]"
          >
            <span v-if="item.getBarcode()">{{ item.getBarcode() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.label"
            class="flex-grow w-[100px]"
          >
            <span v-if="item.getLabel()?.[0]">{{ item.getLabel()![0] }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.isrc"
            class="flex-grow w-[110px]"
          >
            <span v-if="item.getISRC()?.[0]">{{ item.getISRC()![0] }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.copyright"
            class="flex-grow w-[100px]"
          >
            <span v-if="item.getCopyright()">{{ item.getCopyright() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.bpm"
            class="flex-none w-[60px]"
          >
            <span v-if="item.getBPM()">{{ item.getBPM() }}</span>
            <not-applicable-text v-else />
          </div>
          
          <div
            v-if="columns.duration"
            class="flex-none w-[80px]"
          >
            <span v-if="item.getDurationFormatted(true)">{{ item.getDurationFormatted(true) }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.container"
            class="flex-none w-[80px]"
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
              class="h-4 w-4 cursor-pointer "
              :class="[item.isFavorited ? 'text-alert-color' :'hover:text-text-title']"
              @click.stop.prevent="item.toggleFavorite()"
            />
          </div>
          <div
            v-if="columns.sampleRate"
            class="flex-none w-[100px]"
          >
            <span v-if="item.getSampleRateFormatted()">{{ item.getSampleRateFormatted() }}</span>
            <not-applicable-text v-else />
          </div>

          <div
            v-if="columns.bitsPerSample"
            class="flex-none w-[70px]"
          >
            <span v-if="item.getBitsPerSampleFormatted()">{{ item.getBitsPerSampleFormatted() }}</span>
            <not-applicable-text v-else />
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
  @apply truncate;
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
  @apply truncate text-text-subtitle ;

  & > div {
    @apply truncate text-ellipsis;
  }

  &:hover {
    @apply text-accent bg-surface-400/20;
  }

  &.control:hover {
    @apply underline;
  }

  &.currentlyPlaying {
    @apply text-primary bg-primary/10;
    &:hover {
      @apply bg-primary/15;
    }
  }

  &.currentlyInspecting {
    @apply text-inspector-color bg-inspector-color/10;
    &:hover {
      @apply bg-inspector-color/15;
    }
  }
}

</style>