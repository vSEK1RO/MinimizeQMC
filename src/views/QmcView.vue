<script setup>
import { ref } from 'vue'
import FunChooser from '../components/FunChooser.vue'
import FunMinimizer from '../components/FunMinimizer.vue'

const funChoseItems = ref([])
const xfunChoseItems = ref([])
const chose = ref('Σ()')
const funLen = ref(4)

function updateItems(fItems, xfItems, fLen, chs){
  funChoseItems.value=fItems.value
  if(chs.value==='Σ()' || chs.value==='Π()'){
    xfunChoseItems.value=[]
  }else{
    xfunChoseItems.value=xfItems.value
  }
  funLen.value=fLen.value
  chose.value=chs.value
}
</script>

<template>
  <div class="qapp">
    <FunChooser
        :update-items="updateItems"
    />
    <FunMinimizer
        :fun-items="funChoseItems"
        :xfun-items="xfunChoseItems"
        :fun-len="funLen"
        :chose="chose"
    />
  </div>
</template>

<style scoped lang="scss">
.qapp {
  padding: 0 10% 0 10%;
}
</style>