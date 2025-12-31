<template>
  <div class="bookmark-tab">
    <BookmarksByCategory :data="bookmarkData" />
  </div>
</template>

<script>
import BookmarksByCategory from './BookmarksByCategory.vue';

export default {
  name: 'BookmarkTab',
  components: { BookmarksByCategory },
  props: {
    bookmarkData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.bookmark-tab {
  padding: 6px 0;
}
</style>