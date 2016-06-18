(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var viewModel = {
		openNetwork : function(op) {

			if (getPlatform() == 'iOS') {
				if (op == 1) {
					var ref = window.open('fb://profile/1484276845202475', '_blank', 'location=yes');
					ref.addEventListener('loadstart', function(event) {
						setTimeout(function() {
							ref.close();
						}, 500);
					});
					ref.addEventListener('loaderror', function(event) {
						window.open('https://www.facebook.com/PetroecuadorEP/', '_system');
					});
				} else if (op == 2) {
					var ref = window.open('twitter://user?id=153447983', '_blank', 'location=yes');
					ref.addEventListener('loadstart', function(event) {
						setTimeout(function() {
							ref.close();
						}, 500);
					});
					ref.addEventListener('loaderror', function(event) {
						window.open('https://twitter.com/EPPETROECUADOR', '_system');
					});
				} else if (op == 3) {
					var ref = window.open('youtube://www.youtube.com/user/petroecuadorEP', '_blank', 'location=yes');
					ref.addEventListener('loadstart', function(event) {
						setTimeout(function() {
							ref.close();
						}, 500);
					});
					ref.addEventListener('loaderror', function(event) {
						window.open('https://www.youtube.com/user/petroecuadorEP', '_system');
					});
				} else if (op == 4) {
					window.open('https://www.flickr.com/photos/eppetroecuador', '_system');
				}
			} else {
				if (op == 1) {
					window.open('fb://page/1484276845202475', '_system');
				} else if (op == 2) {
					window.open('https://twitter.com/EPPETROECUADOR', '_system');
				} else if (op == 3) {
					window.open('https://www.youtube.com/user/petroecuadorEP', '_system');
				} else if (op == 4) {
					window.open('https://www.flickr.com/photos/eppetroecuador', '_system');
				}
			}

		},

		openPanel : function() {
			$('#pnlLeft').panel('open');
		},

		goToPage : function(op) {
			if (op == 0) {
				$.mobile.changePage("../../index.html");
			} else if (op == 1) {
				$.mobile.changePage("petro.html");
			} else if (op == 2) {
				$.mobile.changePage("map.html");
			} else if (op == 3) {
				$.mobile.changePage("offers.html");
			} else if (op == 4) {
				$.mobile.changePage("social.html");
			}
		}
	};

	$page.on('pageinit', function() {

		ko.applyBindings(viewModel, $page[0]);
		$('.headerText').css('width', ($(window).width() - 60) + 'px');

	}).on('pageshow', function() {

	});

})();