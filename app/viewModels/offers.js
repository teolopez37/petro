(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var viewModel = {

		offers : ko.observableArray([]),

		getOffers : function() {
			dataRequests.getOffers().done(function(response) {
				viewModel.offers(response);
				refreshCarousel('#offersCarousel');
			}).always(function() {

			})
		},

		onImgLoadError : function(data, target) {
			target.target.src = "../../images/noImage.png"
			return true;
		},

		openOffer : function() {
			appData.offerToOpen = this.id;
			$.mobile.changePage("mapOffers.html");
		},

		openPänel : function() {
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
		viewModel.getOffers();
	});

})();