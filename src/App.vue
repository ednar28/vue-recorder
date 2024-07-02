<script setup lang="ts">
import { ref } from 'vue'
import AppRecord from './components/record/app-record.vue'
const url = ref<string>()
const uploaded = (data: string) => {
  url.value = data
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-200">
    <div class="w-48">
      <app-record @audio="uploaded" class="mb-4" />
      <audio v-if="url" :src="url" controls></audio>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
