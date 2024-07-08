<script setup lang="ts">
import WeatherCard from './WeatherCard.vue';
import {useStorageStore} from "../store/storage.ts";

const storageStore = useStorageStore();
</script>

<template>
  <div class="favorites">
    <h2 class="favorites__title">{{ $t('weather.favorites')}}</h2>
    <div v-for="card in storageStore.favorites" :key="card.id">
      <WeatherCard
          :card="card"
          :amount-cards="storageStore.cards.length"
          :in-main="false"
          @toggle-favorite="storageStore.changeFavorites"
          @remove="storageStore.deleteCard"
      />
    </div>
  </div>
</template>

<style scoped>
.favorites__title {
  margin: 1rem auto;
  text-align: center;
}
</style>
