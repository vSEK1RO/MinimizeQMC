<script setup>
import { ref } from 'vue'
import FunChooser from '../components/FunChooser.vue'
import FunMinimizer from '../components/FunMinimizer.vue'
import LocaleChooser from "@/components/LocaleChooser.vue";

const funChoseItems = ref([])
const xfunChoseItems = ref([])
const chose = ref('Σ()')
const funLen = ref(4)

function updateItems(fItems, xfItems, fLen, chs){
  funChoseItems.value=fItems.value
  if(chs.value==='Σ()' || chs.value==='Π()'){
    xfunChoseItems.value=[]
  }else{
    xfunChoseItems.value=xfItems.value
  }
  funLen.value=fLen.value
  chose.value=chs.value
}

</script>

<template>
  <div class="qmc_view">
    <div class="locale_chooser">
      <LocaleChooser/>
    </div>
    <div class="minimizer_qmc">
      <FunChooser
          :update-items="updateItems"
      />
      <FunMinimizer
          :fun-items="funChoseItems"
          :xfun-items="xfunChoseItems"
          :fun-len="funLen"
          :chose="chose"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.locale_chooser {
  z-index: 1;
  position: fixed;
  right: 10px;
  width: 55px;
  height: 40px;
}
@media screen and (min-width: 900px){
  .locale_chooser{
    top: 90px;
  }
  .minimizer_qmc {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (max-width: 900px){
  .locale_chooser{
    top: 70px;
  }
  .minimizer_qmc {
    grid-template-columns: 1fr;
  }
}
.minimizer_qmc {
  height: 100%;
  padding: 5% 10% 5% 10%;
  display: grid;
  justify-content: center;
  align-content: center;
  gap: 14px;
  grid-auto-flow: row;
  grid-template-rows: repeat(auto-fill,fit-content(100px));
  @for $i from 1 through 5 {
    &>:nth-child(#{$i}) {
      grid-column: 1/2;
      grid-row: #{$i}/#{$i + 1};
    }
  }
}
</style>