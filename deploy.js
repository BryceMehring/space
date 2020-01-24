const ghpages = require('gh-pages');
const { spawnSync } = require('child_process');

const gitShowCommand = 'show -s --format=reference';

const output = spawnSync('git', gitShowCommand.split(' '));

if (output.status !== 0) {
  console.error(output.stderr.toString());
  return;
}

const message = `Built from ${output.stdout.toString()}`;

ghpages.publish('dist', {
  branch: 'master',
  history: false,
  message,
}, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Deploy successful');
});
