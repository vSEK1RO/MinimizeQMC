<script setup>
import { ref, computed } from 'vue'
import {doPetrick, getDNF, getKNF, getMNF, prevFun} from "@/utils/qmcUtil";
import {de, tr} from "vuetify/locale";

const props = defineProps({
  "funItems": Array,
  "xfunItems": Array,
  "funLen": Number,
  "chose": String,
})
function toggleDebug(){
  document.body.querySelector('.debug').classList.toggle('invisible')
}

const funDNF = computed(() => {
  deleteMNF()
  return getDNF(props)
})
const funKNF = computed(() => {
  deleteMNF()
  return getKNF(props)
})
const funMDNF = ref([])
const funMKNF = ref([])
const petrickMDNF = ref([])
const petrickMKNF = ref([])
function updateFuns(){
  let MDNF = getMNF(props,funDNF.value,'DNF')
  let MKNF = getMNF(props,funKNF.value,'KNF')
  funMDNF.value = MDNF
  funMKNF.value = MKNF
  if(MDNF!==[] && MKNF!==[]){
    petrickMDNF.value = doPetrick(props,MDNF,'DNF')
    petrickMKNF.value = doPetrick(props,MKNF,'KNF')
  }
}
const prevExpMDNF = computed(() => {
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  if(funMDNF.value.length===0){
    return '0'
  }else if(funMDNF.value[0].startsWith(buffStr)){
    return '1'
  }
  return prevFun(
      props,
      funMDNF.value,
      '','','¬a','','a','','∧',' ∨ '
  )
})
const prevPyMDNF = computed(() => {
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  if(funMDNF.value.length===0){
    return '0'
  }else if(funMDNF.value[0].startsWith(buffStr)){
    return '1'
  }
  return prevFun(
      props,
      funMDNF.value,
      '','','not(a',')','a','',' and ',' or '
  )
})
const prevMDNF = computed(() => {
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  if(funMDNF.value.length===0){
    return '0'
  }else if(funMDNF.value[0].startsWith(buffStr)){
    return '1'
  }
  return prevFun(
      props,
      funMDNF.value,
      '','','ā','','a','','∙',' + '
  )
})
const prevMKNF = computed(() => {
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  if(funMKNF.value.length===0){
    return '1'
  }else if(funMKNF.value[0].startsWith(buffStr)){
    return '0'
  }
  return prevFun(
      props,
      funMKNF.value,
      '(',')','a','','ā','','+',') ∙ ('
  )
})

function deleteMNF(){
  funMDNF.value=[]
  petrickMDNF.value=[]
  prevMDNF.value=[]
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  funMKNF.value=[buffStr]
  petrickMKNF.value=[buffStr]
  prevMKNF.value=[buffStr]
}
</script>

<template>
  <p>
    <v-btn size="x-large" @click="updateFuns">Вычислить</v-btn>
    <h1 class="text-mono">МДНФ: </h1>
    <h3>{{prevMDNF}}</h3>
    <h1 class="text-mono">МКНФ: </h1>
    <h3>{{prevMKNF}}</h3>
    <v-btn size="x-large" @click="toggleDebug">Debug</v-btn>
    <p class="debug">
      <br>funDNF: {{funDNF}}
      <br>funKNF: {{funKNF}}
      <br><br>funMDNF: {{funMDNF}}
      <br>funMKNF: {{funMKNF}}
      <br><br>prevExpMDNF: {{prevExpMDNF}}
      <br>prevPyMDNF: {{prevPyMDNF}}
      <br><br>petrickMDNF: {{petrickMDNF}}
      <br>petrickMKNF: {{petrickMKNF}}
    </p>
  </p>
</template>

<style scoped lang="scss">
.invisible {
  display: none;
}
</style>