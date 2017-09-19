require('./lib/modernizr.js');

const app = (supportsWebgl) => {
  if(supportsWebgl) {
    require('./space/main.js');
    require('./chat/chat.js');
  }
  else {
    $('#no-webgl').show();
  }
};

Modernizr.on('webgl', app);
