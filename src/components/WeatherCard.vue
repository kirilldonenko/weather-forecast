<script setup lang="ts">
import {defineProps, defineEmits, watch, ref, computed, onMounted} from 'vue';
import { ICard } from '../types/types';
import PlacesAutocomplete from './PlacesAutocomplete.vue';
import Modal from "./Modal.vue";
import { LineChart, BarChart } from 'vue-chart-3';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  ChartData
} from 'chart.js';
import {useI18n} from "vue-i18n";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    BarController,
    BarElement
);

const props = defineProps<{
  card: ICard;
  amountCards: number;
  inMain: boolean;
}>();

const emit = defineEmits(['toggleFavorite', 'remove']);
const { t } = useI18n();
const getLineChartData = (data: any, mode: 'day' | 'week'): ChartData<'line'> => {
  const labels = data?.list.map((item: any) => item.dt_txt);
  const temperatures = data?.list.map((item: any) => item.main.temp);

  if (!labels || !labels.length) return { labels: [], datasets: [] };

  if (mode === 'day') {
    const currentDate = labels[0].split(' ')[0];
    const filteredLabels = labels.filter((label: string) => label.startsWith(currentDate));
    const filteredTemperatures = filteredLabels.map((label: string) => {
      const index = labels.indexOf(label);
      return temperatures[index];
    });

    return {
      labels: filteredLabels,
      datasets: [
        {
          label: t('weather.temperature'),
          data: filteredTemperatures,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.5,
        },
      ],
    } as ChartData<'line'>;
  } else {
    return { labels: [], datasets: [] };
  }
};

const getBarChartData = (data: any, mode: 'day' | 'week'): ChartData<'bar'> => {
  const labels = data?.list.map((item: any) => item.dt_txt);

  if (!labels || !labels.length) return { labels: [], datasets: [] };

  if (mode === 'week') {
    const dailyData = data?.list.reduce((acc: any, item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item.main.temp);
      return acc;
    }, {});

    const dailyLabels = Object.keys(dailyData);
    const dailyTemperatures = dailyLabels.map(date => {
      const temps = dailyData[date];
      const avgTemp = Math.round(temps.reduce((sum: number, temp: number) => sum + temp, 0) / temps.length);
      return avgTemp;
    });

    return {
      labels: dailyLabels,
      datasets: [
        {
          label: t('weather.avgTemperature'),
          data: dailyTemperatures,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    } as ChartData<'bar'>;
  } else {
    return { labels: [], datasets: [] };
  }
};

const lineChartData = ref<ChartData<'line'>>({ labels: [], datasets: [] });
const barChartData = ref<ChartData<'bar'>>({ labels: [], datasets: [] });
const viewMode = ref<'day' | 'week'>('day');
const showModal = ref(false);
const options = computed(() => ({
  responsive: true,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: t('weather.time')
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: viewMode.value === 'day' ? t('weather.temperature') : t('weather.avgTemperature')
      }
    }
  }
}));

const toggleFavorite = () => {
  emit('toggleFavorite', props.card.id);
};

const confirmRemoveCard = () => {
  emit('remove', props.card.id);
  showModal.value = false;
};

const removeCard = () => {
  showModal.value = true;
};

const updateLineChartData = () => {
  lineChartData.value = getLineChartData(props.card.weather, viewMode.value);
};

const updateBarChartData = () => {
  barChartData.value = getBarChartData(props.card.weather, viewMode.value);
};

const updateCharts = () => {
  updateLineChartData();
  updateBarChartData();
}

onMounted(() => {
  updateCharts();
});

watch(
    () => props.card.weather,
    () => {
      updateCharts();
    },
    { deep: true }
);

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'day' ? 'week' : 'day';
  updateLineChartData();
  updateBarChartData();
};
</script>

<template>
  <div class="weather-card">
    <div class="weather-card__header">
      <PlacesAutocomplete v-if="inMain" :card-id="card.id" />
      <div class="weather-card__favorite-block">
        <font-awesome-icon v-if="card.isFavorite" icon="heart" class="weather-card__icon" />
        <button class="weather-card__button" @click="toggleFavorite">
          {{ card.isFavorite ? $t('weather.removeFromFavorites') : $t('weather.addToFavorites') }}
        </button>
      </div>
    </div>
    <h2>{{ $t('weather.city') }}: {{ card.city === 'Current Location' ? $t('weather.currentLocation') : card.city }}</h2>
    <div class="weather-card__info">
      <button class="weather-card__button weather-card__button--mode" @click="toggleViewMode">
        {{ viewMode === 'day' ? $t('weather.showWeek') : $t('weather.showDay') }}
      </button>
      <LineChart v-if="viewMode === 'day' && lineChartData.labels?.length && lineChartData.datasets?.length" :chart-data="lineChartData" :options="options" />
      <BarChart v-if="viewMode === 'week' && barChartData.labels?.length && barChartData.datasets?.length" :chart-data="barChartData" :options="options" />
    </div>
    <button class="weather-card__button" v-if="props.amountCards > 1" @click="removeCard">{{ $t('weather.removeCard')}}</button>
    <Modal
        :show="showModal"
        :message="$t('weather.confirmRemove')"
        :is-confirm="true"
        @confirm="confirmRemoveCard"
        @cancel="showModal = false"
    />
  </div>
</template>

<style scoped>
.weather-card {
  border: 1px solid #ccc;
  padding: 0.5rem;
  margin: 0.5rem;
  position: relative;
}
.weather-card__header {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.weather-card__favorite-block {
  display: flex;
  justify-content: center;
  align-items: center;
}
.weather-card__icon {
  margin-right: 1rem;
  color: red;
}
.weather-card__info {
  margin-bottom: 1rem;
  padding: 0 1rem 0 0.5rem;
}
.weather-card__button {
  padding: 1rem;
}
.weather-card__button--mode {
  margin: 1rem auto;
}
@media screen and (min-width: 768px){
  .weather-card__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
