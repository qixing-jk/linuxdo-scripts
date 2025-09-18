<template>
  <ul class="list" v-if="this.list.length > 0">
    <li v-for="item in list" :key="item.id">
      <a
        :href="'https://linux.do/t/topic/' + item.id"
        target="_blank"
        :title="item.title"
        @click="handleLinkClick(item.id)"
      >
        {{ item.title }}
      </a>
      <em>{{ item.highest_post_number }}</em>
    </li>
  </ul>
  <div class="nodata" v-else>暂无最新话题</div>
</template>

<script>
export default {
  props: ["list"],
  emits: ["remove-item"],
  methods: {
    handleLinkClick(itemId) {
      // 点击链接时，向父组件发送移除事件
      this.$emit("remove-item", itemId);
      // 链接的默认行为（跳转）会正常执行
    }
  }
};
</script>
