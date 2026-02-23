const pagination = require('hexo-pagination');

function hasCategory(post, name) {
  if (!post.categories || !post.categories.length) return false;
  const lower = String(name).toLowerCase();
  return post.categories.some((c) => String(c.name).toLowerCase() === lower);
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
