<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否将预览按钮放在标题最左侧</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
};
</script>
