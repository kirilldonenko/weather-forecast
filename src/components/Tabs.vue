<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps<{
  titles: string[]
}>();

const selectedIndex = ref(0);
const selectTab = (index: number) => {
  selectedIndex.value = index;
};
</script>

<template>
  <div class="tabs">
    <div class="tabs__titles">
      <button
          v-for="(tab, index) in props.titles"
          :key="index"
          @click="selectTab(index)"
          class="tabs__titles-item"
          :class="{ active: index === selectedIndex }"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tabs__content">
      <slot :name="`tab-${selectedIndex}`"></slot>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
}
.tabs__titles {
  display: flex;
  margin-left: 1rem;
}
.tabs__titles-item {
  margin-right: 0.5rem;
  padding: 10px;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  background-color: #646cff;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.25s;
  outline: none;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
}
.tabs__titles-item.active {
  font-weight: bold;
  border-bottom: 3px solid #213547;
}
.tabs__titles-item:hover {
  background-color: #213547;
}
.tabs__content {
  border: 1px solid #999;
}
</style>
