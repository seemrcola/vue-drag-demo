<script>
import { defineComponent } from 'vue'
import Moveable from 'vue3-moveable'

export default defineComponent({
  components: {
    Moveable,
  },
  data() {
    return {
      target: [],
      draggable: true,
    }
  },
  methods: {
    mousedown(event) {
      this.target = ['.target']

      this.$nextTick(() => {
        this.$refs.moveable.dragStart(event)
      })
    },
    onDrag(e) {
      e.target.style.transform = e.transform
    },
    toggleDraggable() {
      console.log(this.draggable)
      this.draggable = !this.draggable
    },
  },
})
</script>

<template>
  <div class="root">
    <div class="container" style="position: relative">
      <div class="target" @mousedown="mousedown">
        Target
      </div>
      <button @click="toggleDraggable">
        Toggle {{ draggable }}
      </button>
      <Moveable
        ref="moveable"
        :target="target"
        :draggable="draggable"
        :edge-draggable="false"
        @drag="onDrag"
      />
    </div>
  </div>
</template>
