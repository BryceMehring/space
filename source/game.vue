<template>
  <canvas ref="gameCanvas" :width="width" :height="height" @wheel="onWheel" @mousedown="onMouseDown" @mouseup="onMouseUp" @mousemove="onMouseMove" />
</template>

<script lang="ts">
import { defineComponent, ref, unref, onMounted, onUnmounted, Ref } from 'vue'

export default defineComponent({
  setup() {
    const gameCanvas: Ref<HTMLCanvasElement | null> = ref(null);

    const worker = new Worker(new URL('./space/space.worker.ts', import.meta.url), { type: 'module' });

    const onResize = (event: any) => {
      worker.postMessage({
        topic: 'resize',
        size: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    };

    const onWheel = (event: WheelEvent) => {
      const deltaY = event.deltaY > 0 ? 1 : -1;
      worker.postMessage({
        topic: 'wheel',
        deltaY
      });
    };

    const onMouseDown = () => {
      worker.postMessage({
        topic: 'mousedown'
      });
    };

    const onMouseUp = () => {
      worker.postMessage({
        topic: 'mouseup'
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      worker.postMessage({
        topic: 'mousemove',
        event: {
          movementX: event.movementX,
          movementY: event.movementY,
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: - (event.clientY / window.innerHeight) * 2 + 1,
        },
      });
    }

    onMounted(() => {
      window.addEventListener('resize', onResize);

      const offscreen = unref(gameCanvas)!.transferControlToOffscreen();

      worker.postMessage({ topic: 'canvas', canvas: offscreen }, {
        transfer: [offscreen],
      });

      worker.addEventListener
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onResize);
      worker.postMessage('destroy');
    })

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      worker,
      gameCanvas,
      onWheel,
      onMouseDown,
      onMouseUp,
      onMouseMove
    }
  },
})
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  overflow: hidden;
}
</style>

