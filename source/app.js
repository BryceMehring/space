require('./lib/modernizr.js');

if(Modernizr.webgl) {
  require('./space/main.js');
  require('./chat/chat.js');
}
else {
  $('#no-webgl').show();
}
