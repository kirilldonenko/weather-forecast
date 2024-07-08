<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  show: boolean;
  message: string;
  isConfirm: boolean;
}>();

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  if (props.isConfirm) {
    emit('confirm');
  } else {
    emit('cancel');
  }
};

const cancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="modal-buttons">
        <button @click="confirm">OK</button>
        <button v-if="isConfirm" @click="cancel">No</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}
.modal-content {
  background-color: white;
  margin: 0 1rem;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.modal-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1rem;
}
.modal-buttons button {
  padding: 0.5rem 1rem;
}
</style>
