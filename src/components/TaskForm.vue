<template>
  <q-card>
    <q-form @submit="addTask">
      <q-card-section class="q-pa-md">
        <div class="my-subtitle">Add a new task</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-px-md q-pt-md q-pb-none">
        <div class="row justify-between">
          <q-input
            class="col-6"
            outlined
            input-class="my-body"
            type="text"
            id="title"
            v-model="title"
            label="Task"
            lazy-rules
            no-error-icon
            :rules="[(val) => !!val || 'Invalid task name']"
          />
          <q-input
            style="height: auto; width: 36%"
            outlined
            input-class="my-body"
            type="number"
            id="duration"
            v-model.number="duration"
            suffix="min"
            label="Duration"
            lazy-rules
            no-error-icon
            :rules="[(val) => val > 0 || 'Invalid duration']"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
        <q-btn icon="add" outline color="blue" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTasks } from '../stores/tasks';

const tasksStore = useTasks();
const title = ref('');
const duration = ref(0);

const emit = defineEmits(['added']);
const addTask = () => {
  if (title.value && duration.value > 0) {
    const durationInMs = duration.value * 60 * 1000;
    tasksStore.addTask(title.value, durationInMs);
    title.value = '';
    duration.value = 0;
    emit('added');
  }
};
</script>

<style scoped>
/* Add your styling here */
</style>
