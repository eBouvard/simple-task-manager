<template>
  <div class="task-card-container square50 relative-position">
    <Transition
      name="tada-and-fade-out"
      appear
      enter-active-class="animated tada slower"
      leave-active-class="animated fadeOut slow"
      style="z-index: 5"
    >
      <q-card
        v-show="notificationInProgress"
        class="bg-white square50 absolute flex flex-center"
      >
        <q-card class="success-card smaller-square50" flat>
          <q-card-section
            v-if="notificationInProgress"
            class="full-height full-width flex"
          >
            <div class="remaining-time self-center" style="color: white">
              Good Job !
            </div>
          </q-card-section>
        </q-card>
      </q-card>
    </Transition>
    <q-card
      v-if="!notificationInProgress"
      class="bg-white square50 absolute flex flex-center"
      style="z-index: 1"
    >
      <q-card :class="`bg-${backgroundColor} smaller-square50`" flat>
        <q-card-section class="full-height column justify-between items-center">
          <div class="col-5 q-px-sm flex">
            <div class="action-text self-center" :style="textColor">
              {{ actionText }}
            </div>
          </div>
          <div class="col-5 flex">
            <div class="remaining-time self-center" :style="textColor">
              {{ remainingTimeText }}
            </div>
          </div>
          <div class="col-2"></div>
        </q-card-section>
      </q-card>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Duration } from 'luxon';
import { useTasks } from '../stores/tasks';
import { TaskStatus } from 'src/types';

const tasksStore = useTasks();

const colorMap = {
  [TaskStatus.Pending]: 'blue-grey-10',
  [TaskStatus.RunningWork]: 'red-10',
  [TaskStatus.RunningBreak]: 'pink-10',
  [TaskStatus.Completed]: 'blue-grey-10',
};

const lastTaskCompletedAt = ref(tasksStore.lastTaskCompletedAt);
const lastTaskRunCompletedAt = ref(tasksStore.lastTaskRunCompletedAt);
const initialRunningTask = tasksStore.getRunningTask;
const initialRemainingTime = ref(initialRunningTask?.remainingTime ?? 0);
const remainingTime = ref(0);
const currentTaskStatus = ref<TaskStatus | null>(
  initialRunningTask?.status ?? null,
);

const remainingTimeText = computed(() => {
  const remainingTimeValue = remainingTime.value > 0 ? remainingTime.value : 0;
  if (
    currentTaskStatus.value &&
    (currentTaskStatus.value == TaskStatus.RunningWork ||
      currentTaskStatus.value == TaskStatus.RunningBreak)
  ) {
    return Duration.fromMillis(remainingTimeValue).toFormat('mm:ss');
  }
  return '--:--';
});
const actionText = computed(() => {
  if (currentTaskStatus.value === TaskStatus.RunningWork) {
    return "It's work time !";
  }
  if (currentTaskStatus.value === TaskStatus.RunningBreak) {
    return 'Time to take a break !';
  }
  return 'Ready to go ?';
});
const backgroundColor = computed(() => {
  if (!currentTaskStatus.value) {
    return 'blue-grey-10';
  }
  return colorMap[currentTaskStatus.value];
});
const textColor = computed(() => {
  const color = backgroundColor.value === 'white' ? 'black' : 'white';
  return `color: ${color}`;
});

let lastTimeoutId: NodeJS.Timeout | null = null;
const countdown = () => {
  lastTimeoutId = setTimeout(() => {
    remainingTime.value -= 1000;
    countdown();
  }, 1000);
};
watch(
  () => initialRemainingTime.value,
  (updatedTime) => {
    if (lastTimeoutId) {
      clearTimeout(lastTimeoutId);
      lastTimeoutId = null;
    }
    remainingTime.value = updatedTime;
    countdown();
  },
);
onMounted(() => {
  remainingTime.value = initialRemainingTime.value;
  countdown();
});

tasksStore.$subscribe(() => {
  const currentTask = tasksStore.getRunningTask;
  currentTaskStatus.value = currentTask?.status ?? null;
  initialRemainingTime.value = currentTask?.remainingTime ?? 0;
  if (tasksStore.lastTaskRunCompletedAt !== lastTaskRunCompletedAt.value) {
    playNotificationSound(2000, 2500);
    lastTaskRunCompletedAt.value = tasksStore.lastTaskRunCompletedAt;
  }
  if (tasksStore.lastTaskCompletedAt !== lastTaskCompletedAt.value) {
    notifyCompletion();
    lastTaskCompletedAt.value = tasksStore.lastTaskCompletedAt;
  }
});

const notificationInProgress = ref(false);
const notificationSound = new Audio(
  'https://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3',
);
const notificationDuration = 7500;
const fadeOutNotificationSound = (fadeOutDelay: number, duration: number) => {
  const timePassed = notificationSound.currentTime * 1000;
  if (notificationSound.paused || timePassed > duration) {
    return;
  }
  const linearRatio = (timePassed - fadeOutDelay) / (duration - fadeOutDelay);
  let targetVolume = -4 * Math.pow(linearRatio - 0.5, 3) + 0.5;
  if (targetVolume < 0) {
    targetVolume = 0;
  }
  if (targetVolume > 1) {
    targetVolume = 1;
  }
  notificationSound.volume = targetVolume;
  setTimeout(() => {
    fadeOutNotificationSound(fadeOutDelay, duration);
  }, 100);
};
const playNotificationSound = async (
  fadeOutDelay: number,
  duration: number,
) => {
  notificationSound.currentTime = 0;
  notificationSound.volume = 1;
  await notificationSound.play();
  setTimeout(() => {
    fadeOutNotificationSound(fadeOutDelay, duration);
  }, fadeOutDelay);
  setTimeout(() => {
    notificationSound.pause();
  }, duration);
};
const notifyCompletion = async () => {
  notificationInProgress.value = true;
  playNotificationSound(notificationDuration / 2, notificationDuration);
  setTimeout(() => {
    notificationInProgress.value = false;
  }, notificationDuration);
  const notification = new Notification('Task completed', {
    body: 'Well done !',
  });
  notification.onclick = () => {
    window.focus();
  };
};
</script>

<style scoped>
.square50 {
  height: 52vh;
  width: 52vh;
}

.smaller-square50 {
  height: calc(52vh - 10px);
  width: calc(52vh - 10px);
  box-shadow:
    inset -1px 0px 10px 0px rgba(10, 10, 10, 0.1),
    inset 0px -1px 10px 0px rgba(10, 10, 10, 0.1),
    inset 1px 0px 10px 0px rgba(10, 10, 10, 0.1),
    inset 0px 1px 10px 0px rgba(10, 10, 10, 0.1) !important;
}

.success-card {
  background: #fd1d1d;
  background: repeating-linear-gradient(
    105deg,
    rgba(135, 50, 175, 1) 0%,
    rgba(250, 30, 30, 1) 20%,
    rgba(245, 50, 30, 1) 25%,
    rgba(250, 30, 30, 1) 30%,
    rgba(135, 50, 175, 1) 50%
  );
  background-size: 120vh 452vh;
  background-position-y: top;

  animation: gradient 4s linear infinite;
}

@keyframes gradient {
  0% {
    background-position-x: -120vh;
  }
  100% {
    background-position-x: 120vh;
  }
}

.action-text {
  text-align: center;
  font-family: 'Kode Mono', monospace;
  font-weight: 500;
  font-size: 2.75rem;
}

.remaining-time {
  text-align: center;
  font-family: 'Kode Mono', monospace;
  font-optical-sizing: auto;
  font-weight: 700;
  font-size: 6rem;
}
</style>
