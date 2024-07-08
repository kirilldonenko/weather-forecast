import {createI18n, I18n} from 'vue-i18n';

const messages = {
  en: {
    weather: {
      logo: 'Weather forecast',
      main: 'Main',
      currentLocation: 'Current Location',
      addToFavorites: 'Add to favorites',
      favorites: 'Favorites',
      removeFromFavorites: 'Remove from favorites',
      showWeek: 'Show Week',
      showDay: 'Show Day',
      removeCard: 'Remove card',
      confirmRemove: 'Are you sure you want to remove this card?',
      max5: 'To add, delete the city ... because the maximum is 5',
      city: 'City',
      placeholder: 'Start typing',
      temperature: 'Temperature (°C)',
      avgTemperature: 'Average Temperature (°C)',
      time: 'Time'
    }
  },
  uk: {
    weather: {
      logo: 'Прогноз погоди',
      main: 'Головна',
      currentLocation: 'Поточне місцезнаходження',
      addToFavorites: 'Додати до вибраних',
      favorites: 'Вибрані',
      removeFromFavorites: 'Видалити з вибраних',
      showWeek: 'Показати тиждень',
      showDay: 'Показати день',
      removeCard: 'Видалити картку',
      confirmRemove: 'Ви впевнені, що хочете видалити цю картку?',
      max5: 'Щоб додати, видаліть місто ... тому що максимум 5',
      city: 'Місто',
      placeholder: 'Почніть вводити',
      temperature: 'Температура (°C)',
      avgTemperature: 'Середня температура (°C)',
      time: 'Час'
    }
  }
};

const i18n: I18n = createI18n({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'uk',
  messages,
});

export default i18n;
