<script setup>
import { ref } from 'vue'
import FunChooser from './FunChooser.vue'
import FunMinimizer from './FunMinimizer.vue'

const funChoseItems = ref([])
const xfunChoseItems = ref([])
const chose = ref('Σ()')
const funLen = ref(4)

function updateItems(fItems, xfItems, fLen, chs){
  funChoseItems.value=fItems.value
  xfunChoseItems.value=xfItems.value
  funLen.value=fLen.value
  chose.value=chs.value
}
</script>

<template>
  <FunChooser
  :update-items="updateItems"
  />
  <FunMinimizer
  :fun-items="funChoseItems"
  :xfun-items="xfunChoseItems"
  :fun-len="funLen"
  :chose="chose"
  />
</template>

<style>

</style>