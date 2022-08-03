<template>
  <padded-container>
    <smooth-scrollable-container>
      <div class="flex flex-col gap-2 ">
        <button class="bg-primary py-1 hover:bg-secondary" @click="state.state.notifications = []">Clear All</button>

        <template v-if="state.state.notifications.length == 0">
          <p class="text-true-gray-500">No notifications</p>
        </template>
        <template v-else>
          <notification v-for="notification of state.state.notifications" :notification="notification" />
        </template>
      </div>
    </smooth-scrollable-container>
  </padded-container>
</template>

<script setup lang="ts">
import { useState } from '../amethyst';
import PaddedContainer from './PaddedContainer.vue';
import Notification from './notifications/Notification.vue';
import SmoothScrollableContainer from './SmoothScrollableContainer.vue';

const state = useState();
</script>
