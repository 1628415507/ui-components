import { ref } from 'vue'

export function useResetRef(cb) {
  const state = ref(cb())
  const reset = () => {
    state.value = cb()
  }
  return {
    state,
    reset
  }
}
