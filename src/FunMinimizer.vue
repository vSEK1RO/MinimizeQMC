<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  "funItems": Array,
  "xfunItems": Array,
  "funLen": Number,
  "chose": String,
})

function toBin4(num){
  let str = Number(num).toString(2)
  while(props.funLen-str.length!==0){
    str='0'+str
  }
  return str
}

const funDNF = computed(() => {
  deleteMNF()
  let fun = []
  for(let i=0;i<2**props.funLen;i++){
    if(props.chose==='Σ()' || props.chose==='Σ() + X()'){
      if(props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }else if(props.xfunItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }
    }
    if(props.chose==='Π()' || props.chose==='Π() + X()'){
      if(props.xfunItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }else if(!props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }
    }
  }
  return fun
})
const funKNF = computed(() => {
  deleteMNF()
  let fun = []
  for(let i=0;i<2**props.funLen;i++){
    if(props.chose==='Σ()' || props.chose==='Σ() + X()'){
      if(props.xfunItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }else if(!props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }
    }
    if(props.chose==='Π()' || props.chose==='Π() + X()'){
      if(props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }else if(props.xfunItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }
    }
  }
  return fun
})

const funMDNF = ref([])
function updateMDNF() {
  let fun = funDNF.value
  if(fun.length===2**props.funLen){
    let str=''
    for(let i=0;i<props.funLen;i++){
      str+='*'
    }
    str+='+'
    funMDNF.value=[str]
    return
  }
  for(let i=0;i<props.funLen;i++){
    fun = rangeNF(fun,'DNF')
    fun = mergeAll(fun)
  }
  funMDNF.value=fun
}

const funMKNF = ref([])
function updateMKNF() {
  let fun = funKNF.value
  if(fun.length===2**props.funLen){
    let str=''
    for(let i=0;i<props.funLen;i++){
      str+='*'
    }
    str+='+'
    funMKNF.value=[str]
    return
  }
  for(let i=0;i<props.funLen;i++){
    fun = rangeNF(fun,'KNF')
    fun = mergeAll(fun)
  }
  funMKNF.value=fun
}

function updateFuns(){
  updateMDNF()
  updateMKNF()
}

function rangeNF(funList, type) {
  let fun = []
  for(let i=0;i<=props.funLen;i++){
    fun.push([])
    for(let j=0;j<funList.length;j++){
      if(strCount(funList[j],type==='DNF'?'1':'0')===i){
        fun[i].push(funList[j])
      }
    }
  }
  return fun
}
function mergeAll(funRangedList){
  let fun = []
  let frl = []
  for(let i=0;i<=props.funLen;i++){
    frl.push([])
    for(let j=0;j<funRangedList[i].length;j++){
      frl[i].push(0)
    }
  }
  for(let i=0;i<props.funLen;i++){
    for(let j=0;j<funRangedList[i].length;j++){
      for(let k=0;k<funRangedList[i+1].length;k++){
        if(mergible(
            funRangedList[i][j],
            funRangedList[i+1][k],
        )){
          let buffStr = merge(
              funRangedList[i][j],
              funRangedList[i+1][k],
          )
          if(!fun.includes(buffStr)){
            fun.push(buffStr)
          }
          frl[i][j] = 1
          frl[i+1][k] = 1
        }
      }
    }
  }
  for(let i=0;i<=props.funLen;i++){
    for(let j=0;j<funRangedList[i].length;j++){
      if(frl[i][j]===0){
        fun.push(funRangedList[i][j])
      }
    }
  }
  return fun
}

function merge(str1,str2){
  let xflag=false
  if(str1.endsWith('-')||str2.endsWith('-')){
    xflag=true
  }
  str1=str1.substring(0,str1.length-1)
  str2=str2.substring(0,str2.length-1)
  let str=''
  for(let i=0;i<str1.length;i++){
    if(str1[i]!==str2[i]){
      str+='*'
    }
    if(str1[i]===str2[i]){
      str+=str1[i]
    }
  }
  if(xflag){
    str+='-'
  }else{
    str+='+'
  }
  return str
}

function mergibleAll(funRangedList){
  for(let i=0;i<props.funLen;i++){
    for(let j=0;j<funRangedList[i].length;j++){
      for(let k=0;k<funRangedList[i+1].length;k++){
        if(mergible(
            funRangedList[i][j],
            funRangedList[i+1][k],
        )){
          return true
        }
      }
    }
  }
  return false
}
function mergible(str1,str2){
  str1=str1.substring(0,str1.length-1)
  str2=str2.substring(0,str2.length-1)
  if(str1.length!==str2.length){
    return false
  }
  let c=0
  for(let i=0;i<str1.length;i++){
    if(str1[i]!=='*' && str2[i]!=='*') {
      if (str1[i] !== str2[i]) {
        c++
      }
      if (c > 1) {
        break
      }
    }
    if(str1[i]!=='*' ^ str2[i]!=='*'){
      c++
    }
  }
  if(strCount(str1,'*')!==strCount(str2,'*')){
    return false
  }
  return c <= 1
}

const prevMDNF = computed(() => {
  let str = ''
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  if(funMDNF.value.length===0){
    return '0'
  }else if(funMDNF.value[0].startsWith(buffStr)){
    return '1'
  }
  for(let i=0;i<funMDNF.value.length;i++){
    for(let j=0;j<funMDNF.value[i].length-1;j++){
      if(funMDNF.value[i][j]==='0'){
        str+='ā'+String(props.funLen-1-j)+(j===funMDNF.value[i].length-2?'':'∙')
      }else if(funMDNF.value[i][j]==='1'){
        str+='a'+String(props.funLen-1-j)+(j===funMDNF.value[i].length-2?'':'∙')
      }
    }
    if(str.endsWith('∙')){
      str=str.substring(0,str.length-1)
    }
    str+=i===funMDNF.value.length-1?'':' + '
  }
  return str
})

const prevMKNF = computed(() => {
  let str = '('
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  if(funMKNF.value.length===0){
    return '1'
  }else if(funMKNF.value[0].startsWith(buffStr)){
    return '0'
  }
  for(let i=0;i<funMKNF.value.length;i++){
    for(let j=0;j<funMKNF.value[i].length-1;j++){
      if(funMKNF.value[i][j]==='0'){
        str+='a'+String(props.funLen-1-j)+(j===funMKNF.value[i].length-2?'':'+')
      }else if(funMKNF.value[i][j]==='1'){
        str+='ā'+String(props.funLen-1-j)+(j===funMKNF.value[i].length-2?'':'+')
      }
    }
    if(str.endsWith('+')){
      str=str.substring(0,str.length-1)
    }
    str+=i===funMKNF.value.length-1?'':') ∙ ('
  }
  str+=')'
  return str
})

function strCount(str, char){
  let c=0
  for(let i=0;i<str.length;i++){
    if(str[i]===char){
      c++
    }
  }
  return c
}

function deleteMNF(){
  funMDNF.value=[]
  let buffStr = ''
  for(let i=0;i<props.funLen;i++){
    buffStr+='*'
  }
  funMKNF.value=[buffStr]
}

</script>

<template>
  <v-btn size="x-large" @click="updateFuns">Вычислить</v-btn>
  <h1 class="text-mono">МДНФ: </h1>
  <h3>{{prevMDNF}}</h3>
  <h1 class="text-mono">МКНФ: </h1>
  <h3>{{prevMKNF}}</h3>
  <div class="develop">
    <br><br>{{funMDNF}}<br><br>
    {{funMKNF}}
    <br><br>{{funDNF}}<br><br>
    {{funKNF}}
  </div>
</template>

<style scoped>
.develop{
  display: none;
}
</style>