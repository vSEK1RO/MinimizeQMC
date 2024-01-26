<script setup>
import { ref, computed } from 'vue'
import {doPetrick, getDNF, getKNF, getMNF, prevFunMDNF, prevFunMKNF} from "@/utils/qmcUtil";

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
  deleteMNF()
  let MDNF = getMNF(props,funDNF.value,'DNF')
  let MKNF = getMNF(props,funKNF.value,'KNF')
  funMDNF.value = MDNF
  funMKNF.value = MKNF
  if(MDNF!==[] && MKNF!==[]){
    petrickMDNF.value = doPetrick(props,MDNF,'DNF')
    petrickMKNF.value = doPetrick(props,MKNF,'KNF')
  }
}
const prevPyMDNF = computed(() => {
  return prevFunMDNF(
      props,
      petrickMDNF.value,
      '','','not(a',')','a','',' and ',' or '
  )
})
const prevPyMKNF = computed(() => {
  return prevFunMDNF(
      props,
      petrickMKNF.value,
      '(',')','a','','not(a',')',' or ',') and ('
  )
})
const prevMDNF = computed(() => {
  return prevFunMDNF(
      props,
      petrickMDNF.value,
      '','','ā','','a','','∙',' + '
  )
})
const prevMKNF = computed(() => {
  return prevFunMKNF(
      props,
      petrickMKNF.value,
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
  <v-btn color="#f6f6f6" id="btn__process" size="x-large" @click="updateFuns">Вычислить</v-btn>
  <div class="mdnf_prev">
    <h2 class="text-mono">МДНФ: </h2>
    <h4>{{prevMDNF}}</h4>
  </div>
  <div class="mknf_prev">
    <h2 class="text-mono">МКНФ: </h2>
    <h4>{{prevMKNF}}</h4>
  </div>
  <v-btn color="#f6f6f6" id="btn__debug" size="x-large" @click="toggleDebug">Debug</v-btn>
  <p class="debug invisible">
    prevPyMDNF: {{prevPyMDNF}}
    <br>prevPyMKNF: {{prevPyMKNF}}
    <br><br>funDNF: {{funDNF}}
    <br>funKNF: {{funKNF}}
    <br><br>funMDNF: {{funMDNF}}
    <br>funMKNF: {{funMKNF}}
    <br><br>petrickMDNF: {{petrickMDNF}}
    <br>petrickMKNF: {{petrickMKNF}}
  </p>
</template>

<style scoped lang="scss">
.debug {
  font-size: 0.8em;
}
.invisible {
  display: none;
}
</style>