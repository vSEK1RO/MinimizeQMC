<script setup>
const props = defineProps({
  funLen: Number,
  rectW: Number,
  rectH: Number,
  rects: Array,
  paths: Array,
  texts: Array,
  variables: Array,
  t1: Array,
  tx: Array,
  mt: Array,
})

function isMinterm(idx) {
  let bin = idx.toString(2)
  while (bin.length != props.funLen) {
    bin = '0' + bin
  }
  for (const mt of props.mt) {
    const mt_sliced = mt.slice(0, mt.length - 1)
    const mt_regex = mt_sliced.replaceAll('*', '.')
    if (bin.match(mt_regex)) {
      console.log(bin, mt_regex)
      return true
    }
  }
}
</script>

<template>
  <svg viewBox="-30 -30 170 170" xmlns="http://www.w3.org/2000/svg">
  <template v-for="rect, idx in props.rects" :key="idx">
    <rect :class="isMinterm(idx) ? 'minterm' : ''" :x="rect.x" :y="rect.y" :width="props.rectW" :height="props.rectH"/>
    <text class="t1"
      v-if="props.t1.find(t => t == idx)"
      :x="rect.x + props.rectW * 0.5"
      :y="rect.y + props.rectH * 0.65"
    >1</text>
    <text class="tx"
      v-else-if="props.tx.find(t => t == idx)"
      :x="rect.x + props.rectW * 0.5"
      :y="rect.y + props.rectH * 0.65"
    >x</text>
    <text class="t0"
      v-else
      :x="rect.x + props.rectW * 0.5"
      :y="rect.y + props.rectH * 0.65"
    >0</text>
    <text class="numbers" :x="rect.x + props.rectW * 0.95" :y="rect.y + props.rectH * 0.95">{{ idx }}</text>
  </template>
  <path
    v-for="path, idx in props.paths" :key="idx"
    :transform="path.t"
    :stroke-width="path.sw"
    d="M0 50c-3 0 -6 -3 -6 -6v-13c0 -3 -3 -6 -6 -6c3 0 6 -3 6 -6v-13c0 -3 3 -6 6 -6"/>
  <text class="variables" v-for="text, idx in props.texts" :key="idx" :x="text.x" :y="text.y">{{ props.variables[idx] }}</text>
</svg>
</template>

<style scoped>
svg {
  width: 500px;
  fill: none;
  stroke: #2c3e50;
  stroke-width: 1px;
  stroke-linejoin: round;
  stroke-linecap: round;
}

svg text {
  fill: #2c3e50;
  stroke-width: 0;
}

svg .t1 {
  fill: rgb(40, 192, 40);
}

svg .t0 {
  fill: red;
}

svg .t1,
svg .t0,
svg .tx {
  font-size: 12px;
  text-anchor: middle;
}

svg .numbers {
  font-size: 6px;
  text-anchor: end;
}

svg .variables {
  font-size: 12px;
  text-anchor: middle;
}

svg .minterm {
  fill: rgb(225, 225, 225);
}
</style>