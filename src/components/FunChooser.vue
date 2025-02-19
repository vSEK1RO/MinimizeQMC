<script setup>
import { ref, computed } from 'vue'

import { useI18n } from "vue-i18n"
const { t } = useI18n()

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
const funDefPrev = computed(() => {
  let str = 'F('
  for(let i=0;i<funLen.value;i++){
    str+='a'+String(funLen.value-i-1)
    if(i===funLen.value-1){
      str+=')'
    }else{
      str+=','
    }
  }
  return str
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
  <v-select
      :label="t('fun_chooser.select_type')"
      :items="items"
      variant="solo-filled"
      v-model="chose"
      @update:model-value="clearChoseItems"
  ></v-select>
  <h2 class="text-mono">{{t('fun_chooser.text_vars_count')}}</h2>
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
      :label="t('fun_chooser.select_args')+' '+chose.substring(0,3)"
      :items="funItems"
      multiple
      variant="solo-filled"
      v-model="funChoseItems"
  >
  </v-select>
  <v-select
      :disabled="chose===items[0] || chose===items[1]"
      :label="t('fun_chooser.select_args')+' X()'"
      :items="xfunItems"
      multiple
      variant="solo-filled"
      v-model="xfunChoseItems"
  >
  </v-select>
  <div class="fun_prev">
    <h4>{{funDefPrev}} =</h4>
    <h2>{{funPrev}}</h2>
  </div>
</template>