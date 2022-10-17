import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
    debug: true,
    resources: {
        en: {
            translation: {
                "Add clock": "Add clock",
                "Remove": "Remove"
            }
        },
        ru: {
            translation: {
                "Add clock": "Добавить часы",
                "Remove": "Удалить"
            }
        }
    }
});