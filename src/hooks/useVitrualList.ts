/**
 * @param selector : 一个类名
 * @param list: 要被渲染的列表
 * @alias 使用时使用data-index来传入当前要渲染的item的index
 */

import { watch } from 'vue'
import type { Options } from './types/useVitrualList.d'

export function useVitrualList(
  selector: string,
  list: any[],
  options: Options = { cacheLength: 10, rootSelector: 'body' },
) {
  let elements: Element[]
  let intersectionObserver: any
  const CACHE_LENGTH = options.cacheLength

  function onObserve() {
    elements = Array.from(document.getElementsByClassName(selector))
    for (const ele of elements)
      intersectionObserver.observe(ele)
  }

  function updateObserver() {
    elements = Array.from(document.getElementsByClassName(selector))
    const len = elements.length
    intersectionObserver.observe(elements[len - 1])
  }

  function generateObserver() {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const item of entries) {
          const target = item.target as HTMLElement
          let index = Number(target.dataset.index)
          if (item.intersectionRatio > 0) {
            requestAnimationFrame(() => {
              let count = 0
              while (count < CACHE_LENGTH && index > 0) {
                const ele = (elements[index] as HTMLElement)
                if (ele.style.visibility !== '')
                  ele.style.visibility = ''
                count++
                index--
              }
              count = 0
              while (count < CACHE_LENGTH && index < elements.length - 1) {
                const ele = (elements[index] as HTMLElement)
                if (ele.style.visibility !== '')
                  ele.style.visibility = ''
                count++
                index++
              }
            })
          }
          else {
            requestAnimationFrame(() => {
              if (target.style.visibility === 'hidden')
                return
              target.style.visibility = 'hidden'
            })
          }
        }
      },
      { root: document.querySelector(options.rootSelector) },
    )
  }

  watch(
    () => list.length,
    (nlength, olength) => {
      if (nlength < olength)
        return
      requestAnimationFrame(() => {
        updateObserver()
      })
    },
  )

  return {
    onObserve,
    generateObserver,
  }
}
