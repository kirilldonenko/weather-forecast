<script setup lang="ts">
import {computed, defineProps} from 'vue';
import { useStorageStore } from '../store/storage.ts';
import VueGoogleAutocomplete from 'vue-google-autocomplete';

const props = defineProps<{
  cardId: string;
}>();

const id = computed(() => `map-${props.cardId}`);
const autocompleteRef = computed(() => `autocompleteRef-${props.cardId}`);

const storageStore = useStorageStore();

const getAddressData = (addressData: any) => {
  storageStore.setNewCity(addressData.latitude, addressData.longitude, addressData.locality, props.cardId);
};
</script>

<template>
  <div>
    <vue-google-autocomplete
        :id="id"
        :ref="autocompleteRef"
        class="form-control"
        :placeholder="$t('weather.placeholder')"
        types="(cities)"
        @placechanged="getAddressData"
    />
  </div>
</template>

<style scoped>
input {
  width: 200px;
  padding: 8px;
  margin: 8px 0;
}
</style>
