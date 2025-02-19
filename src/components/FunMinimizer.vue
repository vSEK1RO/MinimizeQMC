<script setup>
import { ref, computed } from 'vue'
import {doPetrick, getDNF, getKNF, getMNF, prevFunMDNF, prevFunMKNF} from "@/utils/qmcUtil";

import { useI18n } from "vue-i18n"
import { countTransistors } from '@/utils/transistorsUtil';
const { t } = useI18n()

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
const transistorsMDNF = computed(() => {
  return countTransistors(petrickMDNF.value, true)
})
const transistorsMKNF = computed(() => {
  return countTransistors(petrickMKNF.value, false)
})

function deleteMNF(){
  funMDNF.value=[]
  petrickMDNF.value=[]
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  funMKNF.value=[buffStr]
  petrickMKNF.value=[buffStr]
}
</script>

<template>
  <v-btn color="#f6f6f6" id="btn__process" size="x-large" @click="updateFuns">{{t('fun_minimizer.button_process')}}</v-btn>
  <div style="display: flex; justify-content: space-between;">
    <div>
      <h2 class="text-mono">{{t('fun_minimizer.text_mdnf')}}</h2>
      <h4>{{prevMDNF}}</h4>
    </div>
    <div>
      <h2>{{ t('fun_minimizer.transistors_count') }} </h2>
      <h4 style="text-align: right;">{{ transistorsMDNF }}</h4>  
    </div>
  </div>
  <div style="display: flex; justify-content: space-between;">
    <div>
      <h2 class="text-mono">{{t('fun_minimizer.text_mcnf')}}</h2>
      <h4>{{prevMKNF}}</h4>
    </div>
    <h4 style="margin-top: 32px;">{{ transistorsMKNF }}</h4>
  </div>
  <v-btn color="#f6f6f6" id="btn__debug" size="x-large" @click="toggleDebug">{{t('fun_minimizer.button_debug')}}</v-btn>
  <p class="debug invisible">
    prevPyMDNF: {{prevPyMDNF}}
    <br>prevPyMCNF: {{prevPyMKNF}}
    <br><br>funDNF: {{funDNF}}
    <br>funCNF: {{funKNF}}
    <br><br>funMDNF: {{funMDNF}}
    <br>funMCNF: {{funMKNF}}
    <br><br>petrickMDNF: {{petrickMDNF}}
    <br>petrickMCNF: {{petrickMKNF}}
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