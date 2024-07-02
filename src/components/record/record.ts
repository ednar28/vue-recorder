import { useDevicesList, useUserMedia } from '@vueuse/core'
import RecordRTC from 'recordrtc'
import { computed, ref, watchEffect } from 'vue'
import { useTimer } from './duration'

export function useRecord() {
  const { seconds, minutes, hours, reset: resetTimer, formatTimer } = useTimer()
  const player = ref<HTMLAudioElement>()
  const recorder = ref<RecordRTC>()
  const isRecording = ref(false)
  const isPaused = ref(false)

  useDevicesList({ requestPermissions: true })
  const { stream, start } = useUserMedia({ constraints: { audio: true } })

  watchEffect(() => {
    if (stream.value && player.value) {
      player.value.srcObject = stream.value
    }
  })

  const duration = computed(() => {
    return {
      seconds: formatTimer(seconds.value),
      minutes: formatTimer(minutes.value),
      hours: formatTimer(hours.value)
    }
  })

  const startRecord = async () => {
    await start()
    if (stream.value) {
      recorder.value = new RecordRTC(stream.value, {
        type: 'audio',
        mimeType: 'audio/wav',
        timeSlice: 1000,
        onTimeStamp: () => {
          seconds.value++
        }
      })
      isRecording.value = true
      recorder.value.startRecording()
    }
  }

  const stopRecord = (callback: (url: string) => void) => {
    isRecording.value = false
    recorder.value?.stopRecording(() => {
      if (recorder.value === undefined) {
        return
      }
      const blob = recorder.value.getBlob()
      const url = URL.createObjectURL(blob)
      callback(url)
      resetTimer()
      recorder.value.destroy()
    })
    stream.value = undefined
  }

  const pauseRecord = () => {
    isPaused.value = true
    recorder.value?.pauseRecording()
  }

  const resumeRecord = () => {
    isPaused.value = false
    recorder.value?.resumeRecording()
  }

  return {
    player,
    stream,

    isRecording,
    isPaused,

    duration,

    startRecord,
    stopRecord,
    pauseRecord,
    resumeRecord
  }
}
