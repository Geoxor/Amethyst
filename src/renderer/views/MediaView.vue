<script setup lang="ts">
import { SubsonicServerOptions, connectToSubsonicServer } from "@/logic/subsonic";
import SubsonicAPI from "subsonic-api";
import { onMounted, ref } from "vue";

interface SavedMediaServer {
  type: "subsonic",
  credentials: SubsonicServerOptions
}

interface MediaServer extends SavedMediaServer { 
  connected: boolean;
  api: SubsonicAPI;
}

const savedMediaServers: SavedMediaServer[] = [
  {
    type: "subsonic",
    credentials: {
      type: "subsonic",
      url: "https://demo.navidrome.org",
      username: "demo",
      password: "demo",
    }
  },
  {
    type: "subsonic",
    credentials: {
      type: "subsonic",
      url: "https://cloud.geoxor.moe",
      username: "geoxor",
      password: "enUHRKYBe6f5",
    }
  }
];

const mediaServers = ref<MediaServer[]>([]);

onMounted(async () => {
  for (let savedMediaServer of savedMediaServers) {
    try {
      const api = await connectToSubsonicServer(savedMediaServer.credentials);
      mediaServers.value.push({...savedMediaServer, connected: true, api});
    } catch (error) {
      console.log(error);
      
    }
  }
});

</script>

<template>
  <div class="p-2">
    <div
      v-for="server of mediaServers"
      :key="server.credentials.url"
      class="p-2 rounded-4px bg-gray-800"
    >
      <p>{{ server.credentials.url }}</p>
      <p>{{ server.connected ? 'Connected' : 'Disconnected' }}</p>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>