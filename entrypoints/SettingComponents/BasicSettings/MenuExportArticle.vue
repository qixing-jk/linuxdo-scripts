<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启论坛文章导出功能</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      exportBtnClass: "linuxdoscripts-export-md",
    };
  },
  methods: {
    injectExportBtn() {
      if ($("." + this.exportBtnClass).length < 1) {
        // 右上角插入按钮
        const btn = $(`
          <button class="btn btn-icon-text ${this.exportBtnClass}" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="d-icon icon icon-tabler icon-tabler-download"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><polyline points="7 11 12 16 17 11" /><line x1="12" y1="4" x2="12" y2="16" /></svg>
            <span class="d-button-label">导出为 Markdown</span>
          </button>
        `);
        $(".linuxdoscripts-btn").append(btn);
        btn.on("click", () => this.showExportDialog());
      }
    },
    showExportDialog() {
      // 计算评论楼层数，使用.regular.contents 的个数
      const commentCount = $(".regular.contents").length - 1;

      const pageTitle =
        document.title.replace(" - LinuxDo", "").trim() || "discourse_export";

      // 检测是否为暗黑模式
      const isDarkMode =
        $("html").hasClass("discourse-dark-mode") ||
        $("html").hasClass("dark-mode") ||
        $("html").hasClass("night-mode");

      // 根据当前模式设置样式
      const styles = {
        background: isDarkMode ? "#242424" : "white",
        text: isDarkMode ? "#e0e0e0" : "#333",
        border: isDarkMode ? "#444" : "#ddd",
        buttonBg: isDarkMode ? "#444" : "#f5f5f5",
        buttonText: isDarkMode ? "#e0e0e0" : "#333",
        primary: isDarkMode ? "#51a7e0" : "#0073aa",
        divider: isDarkMode ? "#444" : "#eee",
        inputBg: isDarkMode ? "#333" : "#fff",
        hint: isDarkMode ? "#aaa" : "#666",
      };

      // 创建导出对话框
      const dialogHTML = `
        <div class="linuxdoscripts-export-dialog" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:${
          styles.background
        };color:${styles.text};border:1px solid ${
        styles.border
      };border-radius:8px;padding:24px;z-index:9999;box-shadow:0 0 20px rgba(0,0,0,0.3);min-width:350px;font-family:system-ui,-apple-system,sans-serif;">
          <h3 style="margin-top:0;margin-bottom:16px;border-bottom:1px solid ${
            styles.divider
          };padding-bottom:12px;font-size:18px;font-weight:500;">导出设置</h3>
          <div style="margin:15px 0;">
            <label style="display:flex;align-items:center;margin-bottom:16px;cursor:pointer;">
              <input type="checkbox" id="export-with-comments" style="margin-right:10px;width:16px;height:16px;"> 
              <span>包含评论</span>
            </label>
            <div id="comments-level-container" style="display:none;margin-top:16px;background:${
              styles.inputBg
            };border-radius:6px;padding:12px;border:1px solid ${styles.border};">
              <label style="display:block;margin-bottom:10px;font-weight:500;">导出楼层数：<span id="selected-level" style="color:${
                styles.primary
              };">${commentCount}</span></label>
              <div style="display:flex;align-items:center;margin-top:10px;">
                <input type="range" id="comments-level" min="0" max="${commentCount}" value="${commentCount}" style="flex:1;margin-right:10px;accent-color:${
        styles.primary
      };">
              </div>
              <div style="font-size:12px;color:${
                styles.hint
              };margin-top:8px;display:flex;justify-content:space-between;">
                <span>仅主楼</span>
                <span>全部 (${commentCount}楼)</span>
              </div>
              <div style="font-size:12px;color:${
                isDarkMode ? "#ff9d9d" : "#d94f4f"
              };margin-top:10px;padding-top:8px;border-top:1px dashed ${styles.border};">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:4px;">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 9v4"/>
                  <path d="M10.363 3.591l-8.106 13.295a1.914 1.914 0 0 0 1.636 2.898h16.214a1.914 1.914 0 0 0 1.636 -2.898l-8.106 -13.295a1.914 1.914 0 0 0 -3.274 0z"/>
                  <path d="M12 16h.01"/>
                </svg>
                注意：只有手动加载的评论才能被导出，需要滚动到底部加载更多评论。
              </div>
            </div>
          </div>
          <div style="text-align:right;margin-top:20px;border-top:1px solid ${
            styles.divider
          };padding-top:16px;display:flex;justify-content:flex-end;gap:12px;">
            <button id="cancel-export" style="padding:8px 16px;background:${
              styles.buttonBg
            };color:${styles.buttonText};border:1px solid ${
        styles.border
      };border-radius:4px;cursor:pointer;font-size:14px;transition:all 0.2s;">取消</button>
            <button id="confirm-export" style="padding:8px 16px;background:${
              styles.primary
            };color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;transition:all 0.2s;">确认导出</button>
          </div>
        </div>
        <div class="linuxdoscripts-export-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,${
          isDarkMode ? "0.7" : "0.5"
        });z-index:9998;"></div>
      `;

      $("body").append(dialogHTML);

      // 添加 CSS 悬停效果
      const style = document.createElement("style");
      style.classList.add("linuxdoscripts-export-style");
      style.textContent = `
        #cancel-export:hover {
          background: ${isDarkMode ? "#555" : "#e5e5e5"} !important;
        }
        #confirm-export:hover {
          background: ${isDarkMode ? "#3a96cf" : "#005d8c"} !important;
        }
        #comments-level {
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: ${isDarkMode ? "#555" : "#d1d1d1"};
          border-radius: 3px;
          outline: none;
        }
        #comments-level::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${styles.primary};
          cursor: pointer;
          border: none;
        }
        #comments-level::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${styles.primary};
          cursor: pointer;
          border: none;
        }
      `;
      document.head.appendChild(style);

      // 绑定事件
      $("#comments-level").on("input", function () {
        $("#selected-level").text($(this).val());
      });

      $("#export-with-comments").on("change", function () {
        $("#comments-level-container").toggle($(this).is(":checked"));
      });

      $("#cancel-export").on("click", () => {
        $(
          ".linuxdoscripts-export-dialog, .linuxdoscripts-export-overlay, .linuxdoscripts-export-style"
        ).remove();
      });

      $("#confirm-export").on("click", () => {
        const includeComments = $("#export-with-comments").is(":checked");
        const commentLevel = parseInt($("#comments-level").val());
        $(
          ".linuxdoscripts-export-dialog, .linuxdoscripts-export-overlay, .linuxdoscripts-export-style"
        ).remove();
        this.exportMarkdown(includeComments, commentLevel, pageTitle);
      });

      // 按 ESC 键关闭对话框
      $(document).on("keydown.exportDialog", (e) => {
        if (e.key === "Escape") {
          $(
            ".linuxdoscripts-export-dialog, .linuxdoscripts-export-overlay, .linuxdoscripts-export-style"
          ).remove();
          $(document).off("keydown.exportDialog");
        }
      });

      // 点击遮罩层关闭对话框
      $(".linuxdoscripts-export-overlay").on("click", () => {
        $(
          ".linuxdoscripts-export-dialog, .linuxdoscripts-export-overlay, .linuxdoscripts-export-style"
        ).remove();
        $(document).off("keydown.exportDialog");
      });
    },
    exportMarkdown(
      includeComments = true,
      commentLevel = 0,
      fileName = "discourse_export"
    ) {
      // 用于跟踪已处理的节点，避免重复输出
      const processedNodes = new Set();
      // 递归转 Markdown，过滤.meta 和 .post-menu-area.clearfix
      function html2md(node) {
        if (processedNodes.has(node)) return "";
        if (node.classList) {
          if (node.classList.contains("meta")) return "";
          if (
            node.classList.contains("post-menu-area") &&
            node.classList.contains("clearfix")
          )
            return "";
        }
        if (node.tagName === "PRE") {
          const codeBlock = node.querySelector("code");
          if (codeBlock) {
            return "\n```\n" + codeBlock.textContent.replace(/\n$/, "") + "\n```\n";
          }
        }
        if (node.tagName === "CODE") {
          if (!node.parentElement || node.parentElement.tagName !== "PRE") {
            return "`" + node.textContent + "`";
          }
        }
        if (node.tagName === "BR") {
          return "  \n";
        }
        if (node.tagName === "P") {
          const content = html2md_children(node).trim();
          return content ? "\n" + content + "\n" : "";
        }
        if (node.tagName === "UL") {
          const items = Array.from(node.children)
            .map((li) => html2md(li))
            .join("");
          return items ? "\n" + items : "";
        }
        if (node.tagName === "OL") {
          let i = 1;
          const items = Array.from(node.children)
            .map((li) => `${i++}. ${html2md_children(li)}\n`)
            .join("");
          return items ? "\n" + items : "";
        }
        if (node.tagName === "LI") {
          const prefix =
            node.parentElement && node.parentElement.tagName === "UL" ? "- " : "";
          return prefix + html2md_children(node) + "\n";
        }
        if (node.tagName === "BLOCKQUOTE") {
          const content = html2md_children(node).trim();
          return content ? "\n> " + content.replace(/\n/g, "\n> ") + "\n" : "";
        }
        if (/^H[1-6]$/.test(node.tagName)) {
          const lv = node.tagName[1];
          const content = html2md_children(node).trim();
          return content ? "\n" + "#".repeat(lv) + " " + content + "\n" : "";
        }
        if (node.tagName === "A") {
          // 如果 a 标签只包含一个 img，直接导出为图片
          if (
            node.childNodes.length === 1 &&
            node.childNodes[0].nodeType === 1 &&
            node.childNodes[0].tagName === "IMG"
          ) {
            const img = node.childNodes[0];
            return `![${img.alt}](${img.src})`;
          }
          let linkText = html2md_children(node).trim();
          // 如果链接文本为空，获取第一个非空兄弟节点的文本
          if (!linkText) {
            let sibling = node.nextSibling;
            while (sibling && !linkText) {
              if (sibling.nodeType === 3 || sibling.nodeType === 1) {
                const text = sibling.textContent.trim();
                if (text) {
                  linkText = text;
                  processedNodes.add(sibling); // 标记为已处理，避免重复输出
                }
              }
              sibling = sibling.nextSibling;
            }
          }
          // 如果仍然没有文本，使用 ↗ 符号
          if (!linkText) {
            linkText = "↗";
          }
          return `[${linkText}](${node.href})`;
        }
        if (node.tagName === "IMG") {
          return `![${node.alt}](${node.src})`;
        }
        // 处理表格
        if (node.tagName === "TABLE") {
          const rows = [];
          const headerRow = [];
          let hasHeader = false;

          // 查找表头
          const thead = node.querySelector("thead");
          if (thead) {
            const thCells = thead.querySelectorAll("th");
            thCells.forEach((th) => {
              headerRow.push(html2md_children(th).trim().replace(/\|/g, "\\|").replace(/\n/g, " "));
            });
            if (headerRow.length > 0) hasHeader = true;
          }

          // 如果没有 thead，尝试从第一行获取表头
          if (!hasHeader) {
            const firstRow = node.querySelector("tr");
            if (firstRow) {
              const thCells = firstRow.querySelectorAll("th");
              if (thCells.length > 0) {
                thCells.forEach((th) => {
                  headerRow.push(html2md_children(th).trim().replace(/\|/g, "\\|").replace(/\n/g, " "));
                });
                hasHeader = true;
              }
            }
          }

          // 获取所有数据行
          const allRows = node.querySelectorAll("tr");
          let startIndex = 0;

          // 如果有表头但没有 thead，跳过第一行
          if (hasHeader && !thead) {
            startIndex = 1;
          }
          // 如果有 thead，从 tbody 开始处理
          if (thead) {
            const tbody = node.querySelector("tbody");
            if (tbody) {
              const tbodyRows = tbody.querySelectorAll("tr");
              tbodyRows.forEach((tr) => {
                const cells = [];
                tr.querySelectorAll("td, th").forEach((cell) => {
                  cells.push(html2md_children(cell).trim().replace(/\|/g, "\\|").replace(/\n/g, " "));
                });
                if (cells.length > 0) rows.push(cells);
              });
            }
          } else {
            for (let i = startIndex; i < allRows.length; i++) {
              const tr = allRows[i];
              const cells = [];
              tr.querySelectorAll("td, th").forEach((cell) => {
                cells.push(html2md_children(cell).trim().replace(/\|/g, "\\|").replace(/\n/g, " "));
              });
              if (cells.length > 0) rows.push(cells);
            }
          }

          // 如果没有表头，使用第一行作为表头
          if (!hasHeader && rows.length > 0) {
            headerRow.push(...rows.shift());
          }

          // 如果仍然没有表头，返回空
          if (headerRow.length === 0) return "";

          // 构建 Markdown 表格
          let tableText = "\n";
          tableText += "| " + headerRow.join(" | ") + " |\n";
          tableText += "| " + headerRow.map(() => "---").join(" | ") + " |\n";
          rows.forEach((row) => {
            // 确保每行的列数与表头一致
            while (row.length < headerRow.length) row.push("");
            tableText += "| " + row.slice(0, headerRow.length).join(" | ") + " |\n";
          });

          return tableText;
        }
        // 跳过表格内部元素的单独处理（已在 TABLE 中处理）
        if (["THEAD", "TBODY", "TR", "TH", "TD"].includes(node.tagName)) {
          return "";
        }
        if (node.tagName === "STRONG" || node.tagName === "B") {
          return `**${html2md_children(node)}**`;
        }
        if (node.tagName === "EM" || node.tagName === "I") {
          return `*${html2md_children(node)}*`;
        }
        return html2md_children(node);
      }
      function html2md_children(node) {
        let text = "";
        node.childNodes.forEach((child) => {
          if (processedNodes.has(child)) return; // 跳过已处理的节点
          if (child.nodeType === 3) {
            text += child.textContent;
          } else if (child.nodeType === 1) {
            text += html2md(child);
          }
        });
        return text;
      }

      let allText = "";

      // 获取主楼内容
      let mainContent = document.querySelector(".regular.contents");
      if (mainContent) {
        allText += html2md(mainContent);
      } else {
        allText = "未找到内容";
      }

      // 如果包含评论，则获取评论内容
      if (includeComments && commentLevel > 0) {
        const allContents = document.querySelectorAll(".regular.contents");

        // 从第二个 (索引 1) 开始才是评论
        for (let i = 1; i <= commentLevel && i < allContents.length; i++) {
          allText += "\n\n---\n\n";
          allText += `### 第 ${i} 楼\n\n`;
          allText += html2md(allContents[i]);
        }
      }

      // 清理多余的空行，按照标准 markdown 格式优化
      // 1. 移除连续的多个空行，最多保留一个空行
      allText = allText.replace(/\n{3,}/g, "\n\n");
      // 2. 移除开头和结尾的空行
      allText = allText.trim();
      // 3. 确保文件末尾有一个换行符（标准 markdown 格式）
      allText += "\n";

      // 使用页面标题作为文件名
      const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "-");

      const blob = new Blob([allText], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeFileName}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
  mounted() {
    if (this.modelValue) {
      this.interval = setInterval(this.injectExportBtn, 1000);
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.interval = setInterval(this.injectExportBtn, 1000);
      } else {
        clearInterval(this.interval);
        $("." + this.exportBtnClass).remove();
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
    $("." + this.exportBtnClass).remove();
  },
};
</script>
