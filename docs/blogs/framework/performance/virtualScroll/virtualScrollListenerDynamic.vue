<template>
  <VirtualList :listData="data" :estimatedItemSize="100" v-slot="slotProps">
    <Item :item="slotProps.item" />
  </VirtualList>
</template>

<script>
import VirtualList from './components/VirtualListDynamic.vue'
import Item from './components/Item.vue'
import faker from 'faker';

let data = [];
for (let id = 0; id < 1000; id++) {
  data.push({
    id,
    value: faker.lorem.sentences() // 长文本
  })
}

export default {
  data(){
    return {
      data
    };
  },
  components: {
    VirtualList,
    Item
  }
}
</script>

<style>

</style>
