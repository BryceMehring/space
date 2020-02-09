import ghpages from 'gh-pages';
import { spawnSync } from 'child_process';

const gitShowCommand = 'show -s --format=reference';

const output = spawnSync('git', gitShowCommand.split(' '));

if (output.status === 0) {
  const message = `Built from ${output.stdout.toString()}`;

  ghpages.publish('dist', {
    branch: 'master',
    history: false,
    message,
  }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Deploy successful');
    }
  });
} else {
  console.error(output.stderr.toString());
}
