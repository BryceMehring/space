let socket = io();

let addMessage = function(msg) {
  $('#messages ul').append($('<li>').text(msg));
};

$('#chat-window form').submit(function() {
  let $m = $('#m');
  let val = $m.val();
  if(val.length) {
    socket.emit('chat message', val);
    addMessage('You: ' + val);
    $m.val('');
    $("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight")}, 100);
  }
  return false;
});

$('#chat-window .fa').on('click', function(obj) {
  var target = $(obj.target);
  target.toggleClass('fa-caret-square-o-up');
  target.toggleClass('fa-caret-square-o-down');

  if(target.hasClass('fa-caret-square-o-up')) {
    $('#chat-window').slideUp();
  }
});

socket.on('chat message', addMessage);
