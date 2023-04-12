import { nextTick, onMounted, ref } from 'vue'

export function useContextMenu(selector: string) {
  const showmenu = ref(false)

  function contextMenu(e: MouseEvent) {
    nextTick(() => {
      const dom = document.querySelector(selector) as HTMLElement
      dom.style.left = `${e.clientX}px`
      dom.style.top = `${e.clientY}px`
    })
    document.addEventListener('click', onClickOutside)
    document.addEventListener('contextmenu', onContextOutside)
  }

  function onClickOutside(event: MouseEvent) {
    showmenu.value = false
    closeContextMenu()
  }

  function onContextOutside(event: MouseEvent) {
    showmenu.value = false
    closeContextMenu()
  }

  function closeContextMenu() {
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('contextmenu', onContextOutside)
  }

  onMounted(() => closeContextMenu)

  return {
    closeContextMenu,
    onClickOutside,
    contextMenu,
    showmenu,
  }
}
