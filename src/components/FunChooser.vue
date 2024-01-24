<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  "updateItems": Function,
})

const funMaxLen = 8
const items = ['Σ()', 'Π()', 'Σ() + X()', 'Π() + X()']
const tickLabels = computed(() => {
  let arr = {}
  for (let i = 2; i <= funMaxLen; i++) {
    arr[i] = i
  }
  return arr
})
const funPrev = computed(() => {
  let str = chose.value
  props.updateItems(funChoseItems,xfunChoseItems,funLen,chose)
  xfunChoseItems.value.sort((a,b)=>Number(a)-Number(b))
  funChoseItems.value.sort((a,b)=>Number(a)-Number(b))
  if(str===items[0] || str===items[1]){
    str = str.substring(0,str.length-1) + funChoseItems.value.join(',') + ')'
  }
  if(str===items[2] || str===items[3]){
    str = str.substring(0,2) + funChoseItems.value.join(',') + ')' +
        ' + X(' + xfunChoseItems.value.join(',') + ')'
  }
  return str
})
const funItems = computed(() => {
  let arr = []
  for (let i = 0; i < 2**funLen.value; i++) {
    if(!xfunChoseItems.value.includes(Number(i))){
      arr.push(i)
    }
  }
  return arr
})
const xfunItems = computed(() => {
  let arr = []
  for (let i = 0; i < 2**funLen.value; i++) {
    if(!funChoseItems.value.includes(Number(i))){
      arr.push(i)
    }
  }
  return arr
})

const chose = ref('Σ() + X()')
const funLen = ref(4)
const funChoseItems = ref([0,5,8,12,15])
const xfunChoseItems = ref([1,2,3,10,13,14])

function clearChoseItems(){
  funChoseItems.value=[]
  xfunChoseItems.value=[]
}

</script>

<template>
  <v-form>
    <v-select
        variant="solo-filled"
        label="Выберите тип задания функции"
        :items="items"
        v-model="chose"
        @update:model-value="clearChoseItems"
    ></v-select>
    <h3 class="text-mono">Выберите количество переменных</h3>
    <v-slider
        :ticks="tickLabels"
        :max="funMaxLen"
        min="2"
        step="1"
        show-ticks="always"
        tick-size="4"
        @update:model-value="clearChoseItems"
        v-model="funLen"
    ></v-slider>
    <v-select
        :label="'Выберите аргументы '+chose.substring(0,3)"
        :items="funItems"
        multiple="true"
        variant="solo-filled"
        v-model="funChoseItems"
    >
    </v-select>
    <v-select
        :disabled="chose===items[0] || chose===items[1]"
        label="Выберите аргументы X()"
        :items="xfunItems"
        multiple="true"
        variant="solo-filled"
        v-model="xfunChoseItems"
    >
    </v-select>
    <h1 class="text-mono">Ваша функция: </h1>
    <h3>{{funPrev}}</h3>
  </v-form>
</template>

<style scoped lang="scss">

</style>