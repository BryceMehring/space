const ghpages = require('gh-pages');

ghpages.publish('dist', {
  branch: 'master',
});