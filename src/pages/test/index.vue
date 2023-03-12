<script>
import Moveable from 'vue3-moveable'
import { ref } from 'vue'
export default {
  components: { Moveable },
  setup() {
    const moveableRef = ref(null)
    const onDragGroup = (e) => {
      e.events.forEach((ev) => {
        ev.target.style.cssText += ev.cssText
      })
    }
    const onRotateGroup = (e) => {
      e.events.forEach((ev) => {
        ev.target.style.cssText += ev.cssText
      })
    }
    const onScaleGroup = (e) => {
      e.events.forEach((ev) => {
        ev.target.style.cssText += ev.cssText
      })
    }
    return { moveableRef, onDragGroup, onRotateGroup }
  },
}
</script>

<template>
  <div class="root">
    <div
      class="container"
      style="width: 500px;height: 500px;border: 1px solid #ccc;"
    >
      <div class="target target1">
        Target1
      </div>
      <div class="target target2">
        Target2
      </div>
      <div class="target target3">
        Target3
      </div>
      <Moveable
        ref="moveableRef"
        :target="['.target1', '.target2']"
        :draggable="true"
        :rotatable="true"
        :scalable="true"
        @dragGroup="onDragGroup"
        @rotateGroup="onRotateGroup"
        @scaleGroup="onRotateGroup"
      />
    </div>
  </div>
</template>
