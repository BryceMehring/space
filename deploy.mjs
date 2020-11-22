import { deploy } from '@brycemehring/gh-pages-deploy';

await deploy({
  basePath: 'dist',
  branch: 'master',
  add: true,
});

console.log('Deploy Successful');
