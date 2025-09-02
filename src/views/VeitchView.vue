<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
// import Diagram from '@/components/Diagram.vue';

const { t } = useI18n()
const route = useRoute()

const rectW = ref(0)
const rectH = ref(0)
const rects = ref([])
const paths = ref([])
const texts = ref([])
const variablesNames = ref('')
const variables = computed(() => {
  return variablesNames.value.split(',').map(variable => variable.trim())
})

switch (route.query.funLen) {
  case '4':
    rectW.value = 25
    rectH.value = 25
    rects.value = [
      { x: 75, y: 75 },
      { x: 50, y: 75 },
      { x: 75, y: 50 },
      { x: 50, y: 50 },
      { x: 0, y: 75 },
      { x: 25, y: 75 },
      { x: 0, y: 50 },
      { x: 25, y: 50 },
      { x: 75, y: 0 },
      { x: 50, y: 0 },
      { x: 75, y: 25 },
      { x: 50, y: 25 },
      { x: 0, y: 0 },
      { x: 25, y: 0 },
      { x: 0, y: 25 },
      { x: 25, y: 25 },
    ]
    paths.value = [
      { t: ''},  
      { t: 'rotate(90) translate(0 -50)'},
      { t: 'rotate(180) translate(-100 -75)'},
      { t: 'rotate(270) translate(-100 25)' },
    ]
    variablesNames.value = 'X3, X2, X1, X0'
    texts.value = [
      { x: -20, y: 29 },
      { x: 25, y: -15 },
      { x: 120, y: 54 },
      { x: 50, y: 122 },
    ]
    break;
  case '3':
    rectW.value = 25
    rectH.value = 25
    rects.value = [
      { x: 75, y: 50 },
      { x: 50, y: 50 },
      { x: 0, y: 50 },
      { x: 25, y: 50 },
      { x: 75, y: 25 },
      { x: 50, y: 25 },
      { x: 0, y: 25 },
      { x: 25, y: 25 },
    ]
    paths.value = [
      { t: 'translate(0 25) scale(0.5 0.5)', sw: '2' },  
      { t: 'rotate(90) translate(25 -50)' },
      { t: 'rotate(270) translate(-75 25)' },
    ]
    variablesNames.value = 'X2, X1, X0'
    texts.value = [
      { x: -15, y: 41 },
      { x: 25, y: 10 },
      { x: 50, y: 98 },
    ]
    break
}
</script>

<template>
  <div class="wrapper">
    <v-text-field
      style="width: 100%; max-width: 400px;"
      :label="t('veitch.variables')"
      v-model="variablesNames"
      ></v-text-field>
    <h3 v-if="route.query.funLen != '3' && route.query.funLen != '4'">
      {{ t('veitch.unsupported') }}
    </h3>
    <div v-else class="diagrams">
      <h3 class="text-mono">{{ t('fun_minimizer.text_mdnf') }}</h3>
      <svg id="svg-MDNF" viewBox="-30 -30 170 170" xmlns="http://www.w3.org/2000/svg">
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
      <h3 class="text-mono">{{ t('fun_minimizer.text_mcnf') }}</h3>
      <!-- <diagram :rect-w="rectW" :rect-h="rectH" :rects :paths :texts :variables/> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
h3 {
  font-size: 28px;
}

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

.wrapper {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.diagrams {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-auto-flow: column;
  justify-items: center;
}

@media screen and (max-width: 900px) {
  .diagrams {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

</style>
