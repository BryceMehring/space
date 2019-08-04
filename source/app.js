import '../vendor/modernizr';
import './assets/stylesheets/style.scss';

const app = (supportsWebgl) => {
  if(supportsWebgl) {
    require('./space/main');
  } else {
    const element = document.getElementById('no-webgl');
    element.style.display = 'block';
  }
};

Modernizr.on('webgl', app);
