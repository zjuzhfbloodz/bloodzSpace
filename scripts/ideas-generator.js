const pagination = require('hexo-pagination');

function getCategories(post) {
  if (!post || !post.categories) return [];
  const cats = post.categories;
  if (Array.isArray(cats)) return cats;
  if (Array.isArray(cats.data)) return cats.data;
  if (typeof cats.toArray === 'function') return cats.toArray();
  if (typeof cats.map === 'function') {
    try { return cats.map((c) => c); } catch (_) {}
  }
  return [];
}

function hasCategory(post, name) {
  const lower = String(name).toLowerCase();
  return getCategories(post).some((c) => String(c && c.name || '').toLowerCase() === lower);
}

hexo.extend.generator.register('index', function (locals) {
  const base = hexo.config.index_generator || {};
  const perPage = base.per_page || hexo.config.per_page || 10;
  const orderBy = base.order_by || '-date';
  const posts = locals.posts.sort(orderBy).filter((post) => !hasCategory(post, 'ideas'));

  return pagination(base.path || '', posts, {
    perPage,
    layout: ['index', 'archive'],
    data: { __index: true }
  });
});

hexo.extend.generator.register('ideas', function (locals) {
  const base = hexo.config.ideas_generator || {};
  const perPage = base.per_page || hexo.config.per_page || 10;
  const orderBy = base.order_by || '-date';
  const posts = locals.posts.sort(orderBy).filter((post) => hasCategory(post, 'ideas'));

  return pagination(base.path || 'ideas', posts, {
    perPage,
    layout: ['index', 'archive'],
    data: { title: 'Ideas', __ideas: true }
  });
});
