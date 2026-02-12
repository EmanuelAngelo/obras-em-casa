import { createI18n } from 'vue-i18n';
import messages from './locales'; // seu arquivo de traduções

const userLocale = navigator.language || navigator.userLanguage || 'pt-BR';

const i18n = createI18n({
  locale: userLocale.split('-')[0], // ex: 'pt'
  fallbackLocale: 'pt',
  messages,
});

export default i18n;
