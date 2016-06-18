(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var viewModel = {

	};

	$page.on('pageinit', function() {

		ko.applyBindings(viewModel, $page[0]);

	}).on('pageshow', function() {

	});

})();