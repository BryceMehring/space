require('./lib/modernizr.js');

if(Modernizr.webgl) {
  require('./space/main.js');
}
else {
  document.getElementById('no-webgl').className = "";
}
