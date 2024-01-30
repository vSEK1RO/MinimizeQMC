import {messages} from "@/locales/i18n_messages";
import {createI18n} from 'vue-i18n';

export const i18n_locales = []
for(let key in messages) {
    i18n_locales.push(key)
}
export const i18n_default = i18n_locales.includes(window.navigator.language)?
    window.navigator.language:i18n_locales[0]
export const i18n = createI18n({
    legacy: false,
    locale: i18n_default,
    fallbackLocale: 'gb',
    messages,
    globalInjection: true,
})