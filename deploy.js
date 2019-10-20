const ghpages = require('gh-pages');
const {
  GITHUB_ACTOR,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  EMAIL
} = process.env;

ghpages.publish('dist', {
  branch: 'master',
  repo: `https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git`,
  user: {
    name: GITHUB_ACTOR,
    email: EMAIL,
  }
}, (err) => {
  if (err) {
    console.error('\n' + err);
  }
});