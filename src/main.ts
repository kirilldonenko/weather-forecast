import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import { useStorageStore } from './store/storage';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import i18n from "./locales.ts";

library.add(faHeart);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n);
const storageStore = useStorageStore();
storageStore.initialize();

app.component('VueGoogleAutocomplete', VueGoogleAutocomplete);
app.component("font-awesome-icon", FontAwesomeIcon)
app.mount('#app');
