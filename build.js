/**
 * 构建脚本：本地和 GitHub Actions 都用它
 *   node build.js
 *
 * 说明：直接调用 hexo 的 API。注意两点：
 *   1) 站点 package.json 里必须有 "hexo": { "version": "..." } 字段，
 *      否则 Hexo 会跳过加载 _config.yml / 主题 / 插件（只复制原始文件）；
 *   2) 用 hexo.load() 之后 locals 里才有文章，用于打印统计。
 */
const path = require('path');
const Hexo = require('hexo');

const baseDir = __dirname;

(async () => {
  const hexo = new Hexo(baseDir, { silent: false });
  await hexo.init();
  await hexo.load();

  const posts = hexo.locals.get('posts').toArray();

  console.log('---------------------------------------------');
  console.log('站点标题 :', hexo.config.title);
  console.log('主题     :', hexo.config.theme);
  console.log('站点地址 :', hexo.config.url);
  console.log('文章数量 :', posts.length);
  posts.slice(0, 10).forEach(p => console.log('   -', p.title));
  console.log('---------------------------------------------');

  await hexo.call('clean', {});
  await hexo.call('generate', {});
  await hexo.exit();

  console.log('BUILD_OK ->', path.join(baseDir, 'public'));
  process.exit(0);
})().catch(err => {
  console.error('BUILD_FAILED:', err && err.message);
  console.error(err && err.stack);
  process.exit(1);
});
