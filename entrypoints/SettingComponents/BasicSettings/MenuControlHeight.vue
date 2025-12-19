<template>
  <div class="item">
    <div class="tit">{{ sort }}. 浏览器边缘触发按钮的范围设置为从底部开始</div>
    <input
      type="number"
      :value="modelValue"
      min="10"
      max="100"
      @change="$emit('update:modelValue', $event.target.value)"
      @blur="handleBlur" />
  </div>
</template>

<script>
export default {
  props: ['modelValue', 'sort'],
  emits: ['update:modelValue'],
  methods: {
    // 提示组件
    messageToast(message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'messageToast-text';
      messageElement.innerText = message;
      document.getElementById('messageToast').appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    handleBlur(event) {
      let value = parseInt(event.target.value);

      // 如果输入的不是有效数字，设置为默认值10
      if (isNaN(value)) {
        value = 10;
      }

      // 检查数值范围并修正
      if (value < 10) {
        value = 10;
        this.messageToast('填入的数字不可小于10！');
      } else if (value > 100) {
        value = 100;
        this.messageToast('填入的数字不可大于100！');
      }

      // 如果值发生了变化，更新父组件
      if (value != event.target.value) {
        event.target.value = value;
        this.$emit('update:modelValue', value);
      }
    }
  }
};
</script>

<style lang="less" scoped>
input {
  width: 100px !important;
}
</style>
