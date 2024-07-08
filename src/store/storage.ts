import { defineStore } from 'pinia';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ICard } from '../types/types';

const API_KEY_WEATHER: string = '5afa27be7ac19c57a42af494922bdab0';
const STORAGE_KEY_CARDS: string = 'weather_app_cards';
const STORAGE_KEY_FAVORITES: string = 'weather_app_favorites';
const FIVE_DAYS_URL: string = 'https://api.openweathermap.org/data/2.5/forecast';
const IP_LOCATION_URL: string = 'https://ipapi.co/json/';

export const useStorageStore = defineStore('storage', {
  state: () => ({
    cards: [] as ICard[],
    favorites: [] as ICard[],
  }),
  actions: {
    async initialize() {
      const storedCards: string | null = localStorage.getItem(STORAGE_KEY_CARDS);
      const storedFavorites: string | null = localStorage.getItem(STORAGE_KEY_FAVORITES);

      if (storedCards) {
        this.cards = JSON.parse(storedCards);
      } else {
        await this.initializeDefaultWeatherCard();
      }

      if (storedFavorites) {
        this.favorites = JSON.parse(storedFavorites);
      }

      this.refreshWeatherData();
    },

    async initializeDefaultWeatherCard() {
      try {
        const { data } = await axios.get(IP_LOCATION_URL);
        const { latitude, longitude } = data;

        if (latitude && longitude) {
          const loadedWeather = await this.fetchFiveDaysWeather(latitude, longitude);

          if (loadedWeather) {
            this.cards.push({
              id: uuidv4(),
              city: 'Current Location',
              latitude,
              longitude,
              weather: loadedWeather,
              isFavorite: false
            });

            this.saveToLocalStorage();
          }
        }
      } catch (error) {
        console.error('Failed to initialize default weather card:', error);
      }
    },

    async refreshWeatherData() {
      for (const card of this.cards) {
        if (card.latitude && card.longitude) {
          const loadedWeather = await this.fetchFiveDaysWeather(card.latitude, card.longitude);
          if (loadedWeather) {
            card.weather = loadedWeather;
          }
        }
      }
      for (const favorite of this.favorites) {
        if (favorite.latitude && favorite.longitude) {
          const loadedWeather = await this.fetchFiveDaysWeather(favorite.latitude, favorite.longitude);
          if (loadedWeather) {
            favorite.weather = loadedWeather;
          }
        }
      }
      this.saveToLocalStorage();
    },

    addWeatherCard() {
      this.cards.push({
        id: uuidv4(),
        city: '',
        latitude: 0,
        longitude: 0,
        weather: null,
        isFavorite: false
      });

      this.saveToLocalStorage();
    },

    async setNewCity(lat: number, lng: number, place: string, cardId: string) {
      const loadedWeather = await this.fetchFiveDaysWeather(lat, lng);
      if (loadedWeather) {
        const foundCard = this.cards.find(item => item.id === cardId);
        if (foundCard) {
          foundCard.city = place;
          foundCard.latitude = lat;
          foundCard.longitude = lng;
          foundCard.weather = loadedWeather;
        }

        const foundFavorite = this.favorites.find(item => item.id === cardId);
        if (foundFavorite) {
          foundFavorite.city = place;
          foundFavorite.latitude = lat;
          foundFavorite.longitude = lng;
          foundFavorite.weather = loadedWeather;
        }

        this.saveToLocalStorage();
      }
    },

    async fetchFiveDaysWeather(lat: number, lng: number) {
      try {
        const { data }: { data: any } = await axios.get(`${FIVE_DAYS_URL}?lat=${lat}&lon=${lng}&appid=${API_KEY_WEATHER}&units=metric`);
        return data;
      } catch (err) {
        console.error('fetchFiveDaysWeather error: ', err);
        return null;
      }
    },

    changeFavorites(id: string) {
      const cardIndex: number = this.cards.findIndex((item) => item.id === id);
      const favoriteIndex: number = this.favorites.findIndex((item) => item.id === id);

      if (cardIndex !== -1) {
        this.cards[cardIndex].isFavorite = !this.cards[cardIndex].isFavorite;
      }

      if (favoriteIndex !== -1) {
        this.favorites = this.favorites.filter((item) => item.id !== id);
      } else if (cardIndex !== -1) {
        this.favorites.push(this.cards[cardIndex]);
      }

      this.saveToLocalStorage();
    },

    deleteCard(id: string) {
      this.cards = this.cards.filter((item) => item.id !== id);
      this.favorites = this.favorites.filter((item) => item.id !== id);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(this.cards));
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(this.favorites));
    }
  }
});
