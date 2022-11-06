<template>
  <div
    class="loading-and-tick"
    :class="model"
    v-if="model != ''"
    :style="`--width:${width}px;--loadingDelay:${loadingDelay}ms`"
  >
    <svg :width="width" :height="width">
      <circle
        class="background-circle"
        fill="none"
        :stroke="`${loadingColor}28`"
        :stroke-width="width / 13"
        :cx="width / 2"
        :cy="width / 2"
        :r="0.4 * width"
        stroke-linecap="round"
      />
      <circle
        class="circle"
        fill="none"
        :stroke="model == 'loading' ? loadingColor : successColor"
        :stroke-width="width / 13"
        :cx="width / 2"
        :cy="width / 2"
        :r="0.4 * width"
        stroke-linecap="round"
        :transform="`rotate(-90 ${width / 2} ${width / 2})`"
      />
      <polyline
        class="tick"
        fill="none"
        :stroke="successColor"
        :stroke-width="width / 11"
        :points="
          `${0.26 * width},${0.53 * width} ${0.46 * width},${0.71 *
            width} ${0.74 * width},${0.36 * width}`
        "
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    // 圆圈宽度，控制大小
    width: {
      type: Number,
      default: 400
    },
    // hidden,loading,tick
    model: {
      type: String,
      default: 'hidden'
    },
    // 完成时圆圈颜色
    successColor: {
      type: String,
      default: '#27ae60'
    },
    // loading时圆圈颜色
    loadingColor: {
      type: String,
      default: '#b2bec3'
    },
    // loading动画延迟多少毫秒开始，防止闪现后立刻完成
    loadingDelay: {
      type: Number,
      default: 400
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-and-tick {
  --width: 100px;
  --loadingDelay: 400ms;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.background-circle {
  stroke-dasharray: calc(var(--width) * 2.513);
  stroke-dashoffset: calc(var(--width) * 5.026);
}
.circle {
  stroke-dasharray: calc(var(--width) * 2.513);
  stroke-dashoffset: calc(var(--width) * 5.026);
}
.tick {
  stroke-dasharray: var(--width);
  stroke-dashoffset: var(--width);
}
.loading-and-tick.loading .background-circle {
  opacity: 0;
  animation: background-loading var(--loadingDelay) forwards;
}
.loading-and-tick.loading .circle {
  opacity: 0;
  animation: circle-loading 2.2s ease-in-out infinite;
  animation-delay: var(--loadingDelay);
}
.loading-and-tick.loading .tick {
  opacity: 0;
}

.loading-and-tick.tick .background-circle {
  animation: background-circle-tick 1.9s ease-in forwards;
}
.loading-and-tick.tick .circle {
  animation: circle-tick 1.9s ease-in forwards;
}
.loading-and-tick.tick .tick {
  animation: tick-tick 1.3s ease-in-out 750ms forwards;
}

@keyframes background-loading {
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes circle-loading {
  0% {
    opacity: 1;
    stroke-dashoffset: calc(var(--width) * 0);
  }
  100% {
    opacity: 1;
    stroke-dashoffset: calc(var(--width) * 5.026);
  }
}

@keyframes circle-tick {
  0% {
    opacity: 1;
    stroke-dashoffset: calc(var(--width) * 2.513);
  }
  40% {
    stroke-dashoffset: calc(var(--width) * 5.026);
  }
  93% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes tick-tick {
  0% {
    stroke-dashoffset: var(--width);
    opacity: 1;
  }
  50% {
    stroke-dashoffset: 0;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes background-circle-tick {
  80% {
    opacity: 1;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
