/**
 * Hexo Helper: 在编译时内联 JS 文件
 * 用于需要立即执行的关键脚本（如主题切换），避免网络延迟导致的闪烁
 */

const path = require("path");
const fs = require("fs");

hexo.once("generateBefore", () => {
  const themePath = hexo.theme_dir;

  /**
   * 内联主题 JS 文件
   * @param {string} filePath - 相对于 source 目录的 JS 文件路径
   * @returns {string} 内联的 <script> 标签
   */
  hexo.extend.helper.register("inline_theme_js", function (filePath) {
    const fullPath = path.join(themePath, "source", filePath);

    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      return `<script>${content}</script>`;
    } catch (err) {
      hexo.log.error(`[inline_theme_js] Failed to read file: ${fullPath}`);
      hexo.log.error(err.message);
      // 返回空注释作为 fallback
      return `<!-- Failed to inline: ${filePath} -->`;
    }
  });
});
