import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
    debug: true,
    resources: {
        en: {
            translation: {
                "Add clock": "Add clock",
                "Remove": "Remove",
                "Project description": "This application enables you to compare times in different timezones instantly. You can check a few places at once. Therefore, making it very easy to find the most suitable time for everybody.",
                'h': 'h'
            }
        },
        ru: {
            translation: {
                "Add clock": "Добавить часы",
                "Remove": "Удалить",
                "Project description": "Это приложение позволяет вам сравнить время в разных часовых поясах, максимально упрощая планирование совещаний, звонков, встреч.",
                'h': 'ч.'
            }
        }
    }
});