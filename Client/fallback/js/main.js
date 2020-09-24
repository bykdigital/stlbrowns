
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

$(document).ready(function() {

	FastClick.attach(document.body);

	var $form = $('form');

	$form.on('submit', function(e) {

		e.preventDefault();

		var $button = $('form .submit');
		var $error = $('form .error');
		
		$error.hide();
		$button.hide();
		
		var valid = false;
		var name = $('#name').val();
		var email = $('#email').val();
		var phone = $('#phone').val();
		var comment = $('#comment').val();

		var nameValid = name !== '';
		var phoneValid = phone !== '';
		var emailValid = validateEmail(email);
		var commentValid = comment && comment !== '' && comment !== ' ';

		if( nameValid && phoneValid && emailValid && commentValid )
			valid = true;

		if( valid ) {

			var data = $form.serialize();

			$.post('/api/contact?', data, function(e) {

				if( e.success ) {

					$form.html(e.message);
				}
			});
		} else {

			$error.show();
			$button.show();
		}
	});
});