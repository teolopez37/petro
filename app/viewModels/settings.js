(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var viewModel = {
		searchRange : ko.observable(6),
		sendNotifications : ko.observable('0'),
		showRangeInput : ko.observable(false),

		showRangeControls : function() {
			viewModel.showRangeInput(true);
			$('#inRange').focus();
		},

		setRange : function() {
			viewModel.showRangeInput(false);
			localStorage.setItem('searchRange', viewModel.searchRange());
		},
		openNetwork : function(op) {
			if (op == 1) {
				window.open('https://www.facebook.com/Petroecuador-EP-1484276845202475', '_system');
			} else if (op == 2) {
				window.open('https://twitter.com/EPPETROECUADOR', '_system');
			} else if (op == 3) {
				window.open('https://www.youtube.com/user/petroecuadorEP', '_system');
			} else if (op == 4) {
				window.open('https://www.flickr.com/photos/eppetroecuador', '_system');
			}
		}

	};

	viewModel.sendNotifications.subscribe(function() {
		localStorage.setItem('sendNotifications', viewModel.sendNotifications());
	})

	$page.on('pageinit', function() {

		ko.applyBindings(viewModel, $page[0]);

	}).on('pageshow', function() {

		if (localStorage.searchRange == undefined) {
			localStorage.setItem('searchRange', '10');
			viewModel.searchRange(10);
		} else {
			viewModel.searchRange(localStorage.searchRange);
		}
		if (localStorage.sendNotifications == undefined) {
			localStorage.setItem('sendNotifications', '0');
			viewModel.sendNotifications('off');
		} else {
			viewModel.sendNotifications(localStorage.sendNotifications == '1' ? '1' : '0');
		}
		$('[name="fpNotifications"]').flipswitch('refresh');

	});

})();