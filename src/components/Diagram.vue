<script setup>
const props = defineProps({
  rectW: Number,
  rectH: Number,
  rects: Array,
  paths: Array,
  texts: Array,
  variables: Array,
})
</script>

<template>
  <svg viewBox="-30 -30 170 170" xmlns="http://www.w3.org/2000/svg">
  <template v-for="rect, idx in rects" :key="idx">
    <rect :x="rect.x" :y="rect.y" :width="rectW" :height="rectH"/>
    <text class="t1"
      v-if="route.query.t1?.find(t => t == idx)"
      :x="rect.x + rectW * 0.5"
      :y="rect.y + rectH * 0.65"
    >1</text>
    <text class="tx"
      v-else-if="route.query.tx?.find(t => t == idx)"
      :x="rect.x + rectW * 0.5"
      :y="rect.y + rectH * 0.65"
    >x</text>
    <text class="t0"
      v-else
      :x="rect.x + rectW * 0.5"
      :y="rect.y + rectH * 0.65"
    >0</text>
    <text class="numbers" :x="rect.x + rectW * 0.95" :y="rect.y + rectH * 0.95">{{ idx }}</text>
  </template>
  <path
    v-for="path, idx in paths" :key="idx"
    :transform="path.t"
    :stroke-width="path.sw"
    d="M0 50c-3 0 -6 -3 -6 -6v-13c0 -3 -3 -6 -6 -6c3 0 6 -3 6 -6v-13c0 -3 3 -6 6 -6"/>
  <text class="variables" v-for="text, idx in texts" :key="idx" :x="text.x" :y="text.y">{{ variables[idx] }}</text>
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
</style>