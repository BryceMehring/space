const ghpages = require('gh-pages');

ghpages.publish('dist', {
  branch: 'master',
}, (err) => {
  if (err) {
    console.error(err);
  }
});