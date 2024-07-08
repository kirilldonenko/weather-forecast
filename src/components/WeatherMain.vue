<script setup lang="ts">
import WeatherCard from './WeatherCard.vue';
import { useStorageStore } from '../store/storage';

const storageStore = useStorageStore();

</script>

<template>
  <div class="weather-main">
    <h2 class="weather-main__title">{{ $t('weather.main')}}</h2>
    <div v-for="card in storageStore.cards" :key="card.id">
      <WeatherCard
        :card="card"
        :amount-cards="storageStore.cards.length"
        :in-main="true"
        @toggle-favorite="storageStore.changeFavorites"
        @remove="storageStore.deleteCard"
      />
    </div>
  </div>
</template>

<style scoped>
.weather-main {
  width: 100%;
  position: relative;
}
.weather-main__title {
  margin: 1rem auto;
  text-align: center;
}
</style>
