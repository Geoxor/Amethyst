<template>
  <div
    class="rounded-4px hover:border-primary-900 duration-50 flex flex-col gap-2 border-surface-500 bg-surface-800 border-1 p-2">
    <slot />
  </div>
  <Handle id="a" type="source" :position="Position.Right" />
  <Handle id="b" type="target" :position="Position.Left" />
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'


</script>