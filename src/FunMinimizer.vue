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
  let fun = []
  for(let i=0;i<2**props.funLen;i++){
    if(props.chose==='Σ()' || props.chose==='Σ() + X()'){
      if(props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }
      if(props.xfunItems.includes(i) && !props.funItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }
    }
    if(props.chose==='Π()' || props.chose==='Π() + X()'){
      if(!props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }
      if(props.xfunItems.includes(i) && props.funItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }
    }
  }
  return fun
})
const funKNF = computed(() => {
  let fun = []
  for(let i=0;i<2**props.funLen;i++){
    if(props.chose==='Σ()' || props.chose==='Σ() + X()'){
      if(!props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }
      if(props.xfunItems.includes(i) && props.funItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }
    }
    if(props.chose==='Π()' || props.chose==='Π() + X()'){
      if(props.funItems.includes(i)){
        fun.push(toBin4(i)+'+')
      }
      if(props.xfunItems.includes(i) && !props.funItems.includes(i)){
        fun.push(toBin4(i)+'-')
      }
    }
  }
  return fun
})

const funMDNF = computed(() => {
  let fun = funDNF.value
  if(fun.length===2**props.funLen){
    let str=''
    for(let i=0;i<props.funLen;i++){
      str+='*'
    }
    str+='+'
    return [str]
  }
  for(let i=0;i<1;i++){
    fun = rangeNF(fun,'DNF')
    fun = mergeAll(fun)
  }
  return fun
})

const funMKNF = computed(() => {
  let fun = funKNF.value
  if(fun.length===2**props.funLen){
    let str=''
    for(let i=0;i<props.funLen;i++){
      str+='*'
    }
    str+='+'
    return [str]
  }
  for(let i=0;i<props.funLen;i++){
    fun = rangeNF(fun,'KNF')
    fun = mergeAll(fun)
  }
  return fun
})

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
        ) && funRangedList[i][j].endsWith('+')
        && funRangedList[i+1][k].endsWith('+')){
          fun.push(merge(
              funRangedList[i][j],
              funRangedList[i+1][k],
          ))
          frl[i][j] = 1
          frl[i+1][k] = 1
        }
      }
    }
  }
  for(let i=0;i<props.funLen;i++){
    for(let j=0;j<funRangedList[i].length;j++){
      for(let k=0;k<funRangedList[i+1].length;k++){
        if(mergible(
            funRangedList[i][j],
            funRangedList[i+1][k],
        ) && (funRangedList[i][j].endsWith('+') && funRangedList[i+1][k].endsWith('-') && frl[i][j]===0
        || funRangedList[i][j].endsWith('-') && funRangedList[i+1][k].endsWith('+') && frl[i+1][k]===0)){
          fun.push(merge(
              funRangedList[i][j],
              funRangedList[i+1][k],
          ))
          frl[i][j] = 1
          frl[i+1][k] = 1
        }
      }
    }
  }
  for(let i=0;i<=props.funLen;i++){
    for(let j=0;j<funRangedList[i].length;j++){
      if(frl[i][j]==0){
        fun.push(funRangedList[i][j])
      }
    }
  }
  return toSet(fun)
}

function merge(str1,str2){
  let xflag=false
  if(str1[str1.length-1]==='-'||str2[str2.length-1]==='-'){
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

function toSet(array){
  let arr = []
  for(let i=0;i<array.length;i++){
    if(!arr.includes(array[i])){
      arr.push(array[i])
    }
  }
  return arr
}

function strCount(str, char){
  let c=0
  for(let i=0;i<String(str).length;i++){
    if(String(str)[i]===String(char)){
      c++
    }
  }
  return c
}

</script>

<template>
  {{funMDNF}}<br><br>
  {{funMKNF}}
</template>

<style scoped>

</style>