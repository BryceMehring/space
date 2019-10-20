const ghpages = require('gh-pages');

ghpages.publish('dist', {
  branch: 'master',
  user: {
    name: 'GitHub Action',
    email: 'action@github.com'
  }
}, (err) => {
  if (err) {
    console.error(err);
  }
});