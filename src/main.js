import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

import {i18n} from "./locales/i18n_init"

createApp(App)
    .use(router)
    .use(vuetify)
    .use(i18n)
    .mount('#app')
