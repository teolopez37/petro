(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var viewModel = {

		mainVideo : ko.observable({}),

		videos : ko.observableArray([]),

		openPanel : function() {
			$('#pnlLeft').panel('open');
		},

		openUrl : function() {
			try {
				if (getPlatform() == 'iOS') {

					var videoUrl = this.videoUrl;
					var videoUrlAux = this.videoUrl;
					videoUrl = videoUrl.replace('https', 'youtube');
					videoUrl = videoUrl.replace('http', 'youtube');
					// window.open(videoUrl);
					var ref = window.open(videoUrl, '_blank', 'location=yes');
					ref.addEventListener('loadstart', function(event) {
						setTimeout(function() {
							ref.close();
						}, 500);
					});
					ref.addEventListener('loaderror', function(event) {
						window.open(videoUrlAux, '_system');
					});
				} else {
					window.open(this.videoUrl, '_system');
				}
			} catch (e) {
				window.open(this.videoUrl, '_system');
			}

		},

		openMainUrl : function() {
			try {
				if (getPlatform() == 'iOS') {
					var videoUrl = viewModel.mainVideo().videoUrl;
					videoUrl = videoUrl.replace('https', 'youtube');
					videoUrl = videoUrl.replace('http', 'youtube');
					// window.open(videoUrl);
					var ref = window.open(videoUrl, '_blank', 'location=yes');
					ref.addEventListener('loadstart', function(event) {
						setTimeout(function() {
							ref.close();
						}, 500);
					});
					ref.addEventListener('loaderror', function(event) {
						window.open(viewModel.mainVideo().videoUrl, '_system');
					});
				} else {
					window.open(viewModel.mainVideo().videoUrl, '_system');
				}
			} catch (e) {
				window.open(viewModel.mainVideo().videoUrl, '_system');
			}
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
		},

		getVideos : function() {

			dataRequests.getVideos().done(function(response) {
				var cont = 0;
				viewModel.videos([]);
				$.each(response, function() {
					if (cont == 0) {
						viewModel.mainVideo(this);
					} else {
						this.placeToShow = cont % 2;
						viewModel.videos.push(this);
					}
					cont++;
				});

			}).always(function() {

			})

		},

		onImgLoadError : function(data, target) {
			target.target.src = "../../images/noImage.png";
			return true;
		},
	};

	$page.on('pageinit', function() {

		ko.applyBindings(viewModel, $page[0]);
		$('.headerText').css('width', ($(window).width() - 60) + 'px');
		refreshCarousel('#newsCarousel');

	}).on('pageshow', function() {
		viewModel.getVideos();
	});

})();