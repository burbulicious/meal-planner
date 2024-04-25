import { onMounted, onUnmounted } from 'vue'

export default function handleKeyDown(cancelFunction: any, targetKey: string): void {
  const onKeyDown = (event: any) => {
    if (event.key === targetKey) {
      cancelFunction()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
