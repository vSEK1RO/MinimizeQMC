<script setup>
import { ref, computed } from 'vue'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {i18n, i18n_default, i18n_locales} from "@/locales/i18n_init";

import { useI18n } from "vue-i18n"
const { t } = useI18n()

const props = defineProps({
  "updateLocale": Function,
})
const choseLocale = computed(() => {
  i18n.global.locale.value = choseFlag.value.slice(19,21)
  return choseFlag.value.slice(19,21)
})
const choseFlag = ref("<span class='fi fi-"+i18n_default+"'></span>")
const flags = computed(() => {
  const fi = []
  for(let i=0;i<i18n_locales.length;i++){
    if(choseLocale.value!==i18n_locales[i]){
      fi.push("<span class='fi fi-"+i18n_locales[i]+"'></span>")
    }
  }
  return fi
})
</script>

<template>
  <v-select
      :items="flags"
      variant="solo-filled"
      v-model="choseFlag"
      density="compact"
  >
    <template #selection="{ item }">
      <div v-html="item.value" @click="onClick"/>
    </template>
    <template #item="{ item, props: {onClick, title, value} }" >
      <v-list-item v-html="item.value"  @click="onClick"/>
    </template>
  </v-select>
</template>

<style lang="scss">
.v-select {
  padding: 0;
}
</style>