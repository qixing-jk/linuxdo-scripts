<template>
  <div class="bookmarks-by-cate">
    <div
      class="category-block"
      v-for="cat in categories"
      :key="cat.name || '未分类'"
    >
      <div class="category-title" @click="toggleCollapse(cat.name)">
        <span class="name">{{ cat.name || '未分类' }}</span>
        <span class="right">
          <span class="count">{{ cat.list.length }}</span>
          <svg class="chevron" :class="{ collapsed: isCollapsed(cat.name) }" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      <ul class="list" v-show="!isCollapsed(cat.name)">
        <li v-for="post in cat.list" :key="post.url">
          <a :href="post.url" target="_blank" :title="post.title">{{ post.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookmarksByCategory',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      collapsedByName: {},
    };
  },
  computed: {
    categories() {
      const folders = Array.isArray(this.data) ? this.data : [];
      const mapped = folders.map((folder) => ({
        name: folder?.name || '未命名',
        list: Array.isArray(folder?.list) ? folder.list : [],
        sort: typeof folder?.sort === 'number' ? folder.sort : 1,
      }));
      // 可按 sort 降序展示（大在前）；如不需要可移除此排序
      return mapped.sort((a, b) => (b.sort ?? 1) - (a.sort ?? 1));
    },
  },
  created() {
    const key = 'sidepanelCollapsedFolders';
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') {
        this.collapsedByName = parsed;
      }
    } catch (e) {}
  },
  methods: {
    toggleCollapse(name) {
      const key = name || '未命名';
      const next = !this.collapsedByName[key];
      this.$set ? this.$set(this.collapsedByName, key, next) : (this.collapsedByName[key] = next);
      try {
        localStorage.setItem('sidepanelCollapsedFolders', JSON.stringify(this.collapsedByName));
      } catch (e) {}
    },
    isCollapsed(name) {
      const key = name || '未命名';
      return !!this.collapsedByName[key];
    },
  },
};
</script>

<style scoped lang="less">
.bookmarks-by-cate {
  .category-block {
    margin-bottom: 16px;
  }
  .category-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 6px;
    background: var(--color-border-2);
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    color: var(--color-fill-0);
    cursor: pointer;
   
  }
  .right {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .chevron {
    transition: transform .2s ease;
    transform: rotate(0deg);
  }
  .chevron.collapsed {
    transform: rotate(180deg);
  }
}
</style>


