<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { amethyst } from "@/amethyst.js";

import BigButton from "../BigButton.vue";

const route = useRoute();
const props = defineProps<{ title: string; description?: string; icon: any; routeName: string; fullwidthMin: boolean }>();
const isActive = computed(() => route.name?.toString().startsWith(props.routeName) || props.routeName === route.name);
const router = useRouter();

</script>

<template>
  <big-button
    :class="[isActive && 'active', amethyst.state.settings.appearance.neonMode && 'neonMode']"
    :title="title"
    :description="description"
    :icon="icon"
    @click="router.push({ name: routeName })"
  />
</template>
