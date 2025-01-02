import { ref, nextTick, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'

export default function useSetTableHeight() {
  const tableHeight = ref(200)
  const pageBodyRef = ref(null)

  const setTableHeight = () => {
    tableHeight.value = 200
    nextTick(() => {
      let rem = document.body.style.getPropertyValue('--rem')
      let boxH = pageBodyRef.value.offsetHeight || pageBodyRef.value?.$el?.offsetHeight
      if (boxH && boxH > 0) {
        tableHeight.value = Math.floor(Math.floor(boxH) - Math.ceil(rem * 1.25))
      }
    })
  }

  onMounted(() => {
    setTableHeight()
    window.addEventListener('resize', setTableHeight)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', setTableHeight)
  })

  onActivated(() => {
    setTableHeight()
    window.addEventListener('resize', setTableHeight)
  })

  onDeactivated(() => {
    window.removeEventListener('resize', setTableHeight)
  })

  return [tableHeight, pageBodyRef, setTableHeight]
}
