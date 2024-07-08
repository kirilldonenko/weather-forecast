<script setup lang="ts">
import Tabs from './Tabs.vue';
import WeatherMain from './WeatherMain.vue';
import Favorites from './Favorites.vue';
import {useI18n} from "vue-i18n";
import {useStorageStore} from "../store/storage.ts";
import {ref} from "vue";
import Modal from "./Modal.vue";

const storageStore = useStorageStore();
const { t, locale } = useI18n();
const titles = [t('weather.main'), t('weather.favorites')];
const changeLang = (lang: string) => {
  locale.value = lang;
};

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
}
const addWeatherCard = () => {
  if (storageStore.cards.length < 5) {
    storageStore.addWeatherCard();
  } else {
    showModal.value = true;
  }
};
</script>

<template>
  <div class="forecast-main">
    <div class="forecast-main__header">
      <img src="../assets/logo.png" class="forecast-main__logo" width="200" height="55" alt="Weather forecast" />
      <h1 class="forecast-main__title">{{$t('weather.logo')}}</h1>
      <div class="forecast-main__lang-switcher">
        <button @click="changeLang('en')">Eng</button>
        <button @click="changeLang('uk')">Укр</button>
      </div>
    </div>
    <Tabs :titles="titles">
      <template #tab-0>
        <keep-alive>
          <WeatherMain />
        </keep-alive>
      </template>
      <template #tab-1>
        <keep-alive>
          <Favorites />
        </keep-alive>
      </template>
    </Tabs>
    <button class="weather-main__add-button" @click="addWeatherCard">+</button>
    <Modal
        :show="showModal"
        :message="$t('weather.max5')"
        :is-confirm="false"
        @confirm="closeModal"
        @cancel="showModal = false"
    />
  </div>
</template>

<style scoped>
.forecast-main {
  position: relative;
  width: 100%;
}
.forecast-main__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
  margin-bottom: 0.5rem;
}
.forecast-main__title {
  display: none;
}
.forecast-main__logo {

}
.forecast-main__lang-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
}
.forecast-main__lang-switcher button {
  margin: 0 0.5rem;
  padding: 0.5rem;
}
.weather-main__add-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  font-size: 2rem;
  z-index: 5;
}
@media screen and (min-width: 768px) {
  .forecast-main__logo {
    right: auto;
    margin: 0;
  }
  .forecast-main__title {
    display: block;
  }
}
</style>
