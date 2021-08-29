<template>
  <Game v-if="playGame" />
  <UI v-model:playGame="playGame" />
</template>

<script lang="ts">
import { defineComponent, computed, ref, unref } from 'vue'
import Game from './game.vue';
import UI from './ui.vue';

export default defineComponent({
  components: {
    Game,
    UI
  },
  setup() {
    const playGame = ref(false);

    return {
      playGame,
    }
  }
})
</script>

