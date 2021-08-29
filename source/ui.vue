<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <button class="btn btn-primary" @click="onPlayGame">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  emits: ['update:playGame', 'test'],
  props: {
    playGame: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    const buttonText = computed(() => {
      const state = props.playGame ? 'End' : 'Play';
      return `${state} Game`;
    })

    const onPlayGame = () => {
      emit('update:playGame', !props.playGame);
    }

    return {
      buttonText,
      onPlayGame
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  color: white;
}
</style>

