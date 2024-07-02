<script setup lang="ts">
import RecordRegular from '../icons/record-regular.vue'
import PlayRegular from '../icons/play-regular.vue'
import PauseRegular from '../icons/pause-regular.vue'
import DoneDuotone from '../icons/done-duotone.vue'
// @ts-ignore-line
import { AVMedia } from 'vue-audio-visual'
import { useRecord } from './record'

const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator
if (!SUPPORTS_MEDIA_DEVICES) {
  console.log('Your browser does not support to access media devices')
}

const emit = defineEmits<{
  (e: 'audio', data: string): void
}>()

const {
  player,
  stream,
  isRecording,
  duration,
  isPaused,
  resumeRecord,
  startRecord,
  stopRecord,
  pauseRecord
} = useRecord()

const saved = (val: string) => {
  emit('audio', val)
}
</script>

<template>
  <div class="card bg-white min-w-48 space-y-3">
    <div class="text-center font-semibold text-xl">
      {{ duration.hours }} : {{ duration.minutes }} : {{ duration.seconds }}
    </div>

    <div class="h-10 flex items-center justify-center bg-gray-300 -mx-2">
      <a-v-media :media="stream" type="symmetric" :caps-height="2" class="w-full" />
      <audio class="hidden" ref="player" controls>
        Your browser does not support the audio element.
      </audio>
    </div>

    <div class="flex items-center justify-around">
      <template v-if="!isRecording">
        <button @click="startRecord">
          <record-regular class="text-4xl text-red-500" />
        </button>
      </template>
      <template v-else>
        <button v-if="!isPaused" @click="pauseRecord">
          <pause-regular class="text-xl text-gray-500" />
        </button>
        <button v-else @click="resumeRecord">
          <play-regular class="text-2xl text-red-500" />
        </button>

        <button @click="stopRecord(saved)">
          <done-duotone class="text-4xl text-red-500" />
        </button>
      </template>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.card {
  @apply shadow rounded-2xl p-2;
}
</style>
