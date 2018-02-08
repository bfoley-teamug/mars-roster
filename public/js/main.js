$(document).ready(function() {
  $('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
  var conf = confirm('Are you sure?');

  if(conf) {
    $.ajax({
      type: 'DELETE',
      url: '/users/delete/'+$(this).data('id') //'this' is used here to keep from deleting the top entry in same class
    }).done(function(response) {
      window.location.replace('/');
    });
    window.location.replace('/');
  } else {
    return false;
  }
}
