<template>
  <div class="item">
    <div class="tit">{{ sort }}. 快速查看浏览历史已读列表</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
};
</script>
