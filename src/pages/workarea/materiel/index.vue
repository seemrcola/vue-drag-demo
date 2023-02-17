<script setup lang='ts'>

</script>

<template>
  <div wh-full bg="#333">
    <div w-full h="30px" border="#fff 1px solid">
      xxxx
    </div>
    <div
      w="40px" h="[calc(100%-30px)]"
      flex flex-col items-center
      py-2 border="#fff 1px solid"
      class="icons"
    >
      <div border="#789 1px solid" mb-2 rounded-1>
        <div h-6 w-6 i-icon-park-solid:game />
      </div>
      <div border="#d55 1px solid" mb-2 rounded-1>
        <div h-6 w-6 i-simple-icons:soundcharts />
      </div>
      <div border="#559 1px solid" mb-2 rounded-1>
        <div h-6 w-6 i-material-symbols:list-alt-add-outline />
      </div>
      <div border="#3a3 1px solid" mb-2 rounded-1>
        <div h-6 w-6 i-carbon:shape-intersect />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icons {
  > div {
    height: 40px;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .8s;
    cursor: pointer;
    &:hover {
      color: yellow;
      background-color: violet;
      border-radius: 0.5rem;
    }
  }
}
</style>
