<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否新标签页打开话题</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
      if (this.modelValue) {
        function handleLinkClick(e) {
          const linkSelector='.link-top-line a.raw-link, .search-results a.search-link, .search-result-topic a.search-link'
          // 检查被点击的元素或其父元素是否是要找的<a>标签
          const link = e.target.closest(linkSelector);
          
          if (link && link.href) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            window.open(link.href, '_blank', 'noopener,noreferrer');
          }
        }
        
        // 使用事件委托，在 body 上监听一次即可，无需 MutationObserver
        // 使用 { capture: true } 在捕获阶段拦截事件，确保最高优先级
        document.body.addEventListener('click', handleLinkClick, { capture: true });
      }
    },

};
</script>
