<script setup lang="ts">
import { onMounted, ref } from "vue";

const srcFolder = ref("");
const allFiles = ref([]);

onMounted(() => {
	const loadFolder = async () => {
		srcFolder.value = "F:/MusicPlaylistFlac";
		allFiles.value = await window.electron.ipcRenderer.invoke("open-folder", [srcFolder.value]);
	};
	loadFolder();
});
</script>

<template>
  <div class="">
    <h1>Explorer</h1>
    {{ allFiles }}
  </div>
</template>

