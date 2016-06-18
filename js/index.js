(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var viewModel = {

		homeNews : ko.observableArray([]),
		
		urlToOpen : ko.observable('comgooglemaps://?saddr=&daddr=-0.2102433,-78.4884734&directionmode=transit&nav=1'),

		getHomeNews : function() {

			if (window.appData.homeNews.length != 0) {
				viewModel.homeNews(window.appData.homeNews);
				refreshCarousel('#galleryCarousel');
			} else {
				dataRequests.getHomeNews().done(function(response) {
					viewModel.homeNews(response);
					window.appData.homeNews = response
					refreshCarousel('#galleryCarousel');
				}).always(function() {
				});
			}

		},

		onImgLoadError : function(data, target) {
			target.target.src = "images/noImage.png"
			return true;
		},

		goToPage : function(op) {
			if (op == 1) {
				$.mobile.changePage("app/views/petro.html");
			} else if (op == 2) {
				$.mobile.changePage("app/views/map.html");
			} else if (op == 3) {
				$.mobile.changePage("app/views/offers.html");
			} else if (op == 4) {
				$.mobile.changePage("app/views/social.html");
			}
		},

		openLink : function() {
			window.open(this.url, '_system');
		}

	};

	$page.on('pageinit', function() {
		ko.applyBindings(viewModel, $page[0]);
		$('.menuItemText').css('width', ($(window).width() - 139) + 'px');

		dataRequests.getMainData().done(function(response) {
			if (!response) {
				alert('error');
				navigator.app.exitApp();
			}
		});

		viewModel.getHomeNews();
	}).on('pageshow', function() {

	});

})();
