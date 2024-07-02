import { ref, watch } from 'vue'

export function useTimer() {
  const seconds = ref(0)
  const minutes = ref(0)
  const hours = ref(0)

  watch(seconds, () => {
    if (seconds.value === 60) {
      seconds.value = 0
      minutes.value++
    }
  })

  watch(minutes, () => {
    if (minutes.value === 60) {
      minutes.value = 0
      hours.value++
    }
  })

  const reset = () => {
    seconds.value = 0
    minutes.value = 0
    hours.value = 0
  }

  const formatTimer = (val: number) => {
    return String(val).padStart(2, '0')
  }

  return {
    seconds,
    minutes,
    hours,
    reset,
    formatTimer
  }
}
