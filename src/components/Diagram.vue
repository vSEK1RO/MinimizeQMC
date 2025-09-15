<script setup>
import { computed, ref } from 'vue'

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
  showStroke: Boolean,
  showFill: Boolean,
})

const colors = ref(["fuchsia", "red", "yellow", "lime", "aqua", "blue", "purple", "darkred", "orange", "green", "navy", "teal"])

const mt = computed(() => {
  const terms = Array(props.mt.length)
  const cells = Array(props.mt.length)

  for (let j = 0; j < props.mt.length; j++) {
    terms[j] = { lx: 100, ly: 100, hx: 0, hy: 0 }
    cells[j] = new Set
    const mt_sliced = props.mt[j].slice(0, props.mt[j].length - 1)
    const mt_regex = mt_sliced.replaceAll('*', '.')

    for (let i = 0; i < 2 ** props.funLen; i++) {
      let bin = i.toString(2)
      while (bin.length != props.funLen) {
        bin = '0' + bin
      }
      
      if (bin.match(mt_regex)) {
        cells[j].add(i)
        const x = props.rects[i].x
        const y = props.rects[i].y
        if (x < terms[j].lx || y < terms[j].ly) {
          terms[j].lx = x
          terms[j].ly = y
        }
        if (x > terms[j].hx || y > terms[j].hy) {
          terms[j].hx = x
          terms[j].hy = y
        }
      }
    }
    terms[j].hx += props.rectW * 0.95
    terms[j].hy += props.rectH * 0.95
    terms[j].lx += props.rectW * 0.05
    terms[j].ly += props.rectH * 0.05
  }
  
  return { terms, cells }
})
</script>

<template>
  <svg viewBox="-30 -30 170 170" xmlns="http://www.w3.org/2000/svg">
    <template v-for="rect, idx in props.rects" :key="idx">
      <rect v-if="mt.cells.length == 0" :x="rect.x" :y="rect.y" :width="props.rectW" :height="props.rectH"/>
      <template v-for="cell, jdx in mt.cells" :key="jdx">
        <rect
          :x="rect.x" :y="rect.y" :width="props.rectW" :height="props.rectH"
          :fill="cell.has(idx) && showFill ? 'color-mix(in lab,'+ colors[jdx] +', 80% transparent)' : ''"/>
      </template>
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
      <text class="numbers" :x="rect.x + props.rectW * 0.9" :y="rect.y + props.rectH * 0.9">{{ idx }}</text>
    </template>
    <path
      v-for="term, idx of mt.terms" :key="idx"
      :d="`M${term.lx} ${term.ly}h${term.hx - term.lx}v${term.hy - term.ly}h${term.lx - term.hx}Z`"
      :stroke="showStroke ? colors[idx] : 'none'"
    />
    <path
      v-for="path, idx in props.paths" :key="idx"
      :transform="path.t"
      :stroke-width="path.sw * rectW / 25"
      d="M0 50c-3 0 -6 -3 -6 -6v-13c0 -3 -3 -6 -6 -6c3 0 6 -3 6 -6v-13c0 -3 3 -6 6 -6"/>
    <text class="variables" v-for="text, idx in props.texts" :key="idx" :x="text.x" :y="text.y">{{ props.variables[text.idx ?? idx] }}</text>
  </svg>
</template>

<style scoped>
svg {
  max-width: 35vw;
  fill: none;
  stroke: #2c3e50;
  stroke-width: calc(v-bind('rectW') / 25 * 1px);
  stroke-linejoin: round;
  stroke-linecap: round;
}

@media (max-width: 800px) {
  svg {
    max-width: none;
  }
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
  font-size: calc(v-bind('rectW') / 25 * 12px);
  text-anchor: middle;
}

svg .numbers {
  font-size: calc(v-bind('rectW') / 25 * 6px);
  text-anchor: end;
}

svg .variables {
  font-size: calc(v-bind('rectW') / 25 * 12px);
  text-anchor: middle;
}
</style>
