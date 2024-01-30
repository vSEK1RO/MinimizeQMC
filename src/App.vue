<script setup>
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const base = process.env.NODE_ENV === 'production' ? '/MinimizeQMC/' : '/'
</script>

<template>
  <header>
    <h1 class="text-mono">{{t('header')}}</h1>
  </header>
<!--    <router-link to="/">Минимизация по Квайну-МакКласки</router-link>-->
<!--    <router-link to="/beta">Проверка на общезначимость Э.Бэта</router-link>-->
  <router-view/>
  <footer>
    <a href="https://icis.mephi.ru/">
      <img :src="base + 'assets/mephi_white.svg'" height="60px">
    </a>
    <a href="https://github.com/vSEK1RO/MinimizeQMC">
      <img :src="base + 'assets/github-mark-white.svg'" height="60px">
    </a>
  </footer>
</template>

<style scoped lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-size: 20px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
@media screen and (min-width: 900px){
  header{
    height: 80px;
  }
  footer{
    position: fixed;
    bottom: 0;
  }
}
@media screen and (max-width: 900px){
  header{
    height: 60px;
  }
  footer{
    position: static;
  }
}
footer, header{
  font-size: calc(0.5em + 0.8vw);
  width: 100%;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit,minmax(100px,1fr));
  left: 0;
  z-index: 1;
  backdrop-filter: blur(4px);
  color: white;
  background-color: rgba(44, 62, 80, 0.7);
}
header {
  position: sticky;
  top: 0;
  justify-items: center;
  align-items: center;
}
footer {
  height: 80px;
  @for $i from 1 through 3 {
    &>:nth-child(#{$i}) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
a {
  text-decoration: none;
  color: white;
}
</style>