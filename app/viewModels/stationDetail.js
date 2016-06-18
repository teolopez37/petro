(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');
	var map;
	var directionsService;
	var directionsDisplay;
	var markers = [];

	var viewModel = {

		thisStation : ko.observable(appData.currentStation),
		stationImageUrl : ko.observable(''),

		currLat : '',
		currLon : '',

		e : ko.observable(false), // extra
		s : ko.observable(false), // super
		a : ko.observable(false), // eco
		d : ko.observable(false), // diesel
		l : ko.observable(false), // lubricant
		c : ko.observable(false), // atm
		s : ko.observable(false), // minimarket
		m : ko.observable(false), // mechanic

		isMapExpanded : ko.observable(false),

		toogleExpandMap : function() {
			if (viewModel.isMapExpanded()) {
				$('.map-content').css('position', 'relative').css('top', '').css('left', '').css('right', '').css('bottom', '')
				$('#map-canvas').css('height', '400px');
			} else {
				$('.map-content').css('position', 'absolute').css('top', 0).css('left', 0).css('right', 0).css('bottom', 0)
				$('#map-canvas').css('height', $(document).height() - parseInt($('.ui-header').css('height')) - parseInt($('.ui-footer').css('height')))
			}
			viewModel.isMapExpanded(!viewModel.isMapExpanded());
		},

		getStationImage : function() {

			dataRequests.getStationImage({
				stationId : viewModel.thisStation().id
			}).done(function(response) {
				viewModel.stationImageUrl(response.stationImg);
			}).always(function() {
			});
		},

		getPosition : function() {
			try {
				navigator.geolocation.getCurrentPosition(viewModel.loadMap, viewModel.getPositionError, {
					timeout : 10000
				});
			} catch (e) {
				console.log(e);
				viewModel.loadMap({
					coords : {
						latitude : '-0.2037631',
						longitude : '-78.4944386'
					}
				});
			}
		},

		tryToInitMap : function() {
			setTimeout(function() {

				if (google.maps.event == undefined) {
					console.log('event undefined');
					viewModel.tryToInitMap();
				} else {
					// google.maps.event.addDomListener(window, 'load',
					// viewModel.loadMap());
					google.maps.event.addDomListener(window, 'load', viewModel.getPosition());

				}
			}, 100)
		},

		calculateRoute : function(lat, lon) {
			var targetDestination = new google.maps.LatLng(viewModel.thisStation().latitude, viewModel.thisStation().longitude);
			var currentPosition = new google.maps.LatLng(viewModel.currLat, viewModel.currLon);

			var request = {
				origin : currentPosition,
				destination : targetDestination,
				travelMode : google.maps.DirectionsTravelMode["DRIVING"]
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setPanel(document.getElementById("directions"));
					directionsDisplay.setDirections(response);

					$("html, body").animate({
						scrollTop : $(document).height()
					}, 1000);
				} else {
					$("#results").hide();
				}
			});

		},

		loadMap : function(position) {

			viewModel.currLat = position.coords.latitude;
			viewModel.currLon = position.coords.longitude;
			var latLngs = []

			var currLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			latLngs.push(currLocation);

			var mapOptions = {
				zoom : 13,
				center : currLocation,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				zoomControl : false,
				streetViewControl : false,
				mapTypeControl : false
			};

			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			directionsService = new google.maps.DirectionsService();
			directionsDisplay = new google.maps.DirectionsRenderer();

			directionsDisplay.setMap(map);

			var mapMarker = {
				url : '../../images/markerDefault.png',
				size : new google.maps.Size(46, 55),
				origin : new google.maps.Point(0, 0),
				anchor : new google.maps.Point(0, 32)
			};
			var currMarker = new google.maps.Marker({
				icon : mapMarker,
				position : currLocation,
				map : map,
				title : 'Disponible'
			});

			markers.push(currMarker);

			// viewModel.placeMarker(currLocation);

			// google.maps.event.addListener(map, 'click', function(event) {
			// viewModel.placeMarker(event.latLng);
			// });

			var stationLocation = new google.maps.LatLng(viewModel.thisStation().latitude, viewModel.thisStation().longitude);
			latLngs.push(stationLocation);

			mapMarker = {
				url : '../../images/markerPetro.png',
				size : new google.maps.Size(46, 55),
				origin : new google.maps.Point(0, 0),
				anchor : new google.maps.Point(0, 32)
			};
			var staMarker = new google.maps.Marker({
				icon : mapMarker,
				position : stationLocation,
				map : map,
				title : 'Disponible'
			});

			// markers.push(staMarker);
			var latlngbounds = new google.maps.LatLngBounds();
			$.each(latLngs, function() {
				latlngbounds.extend(this);
			});
			map.setCenter(latlngbounds.getCenter());
			map.fitBounds(latlngbounds);

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
		$('.station2').css('width', ($(window).width() - 208) + 'px');
		viewModel.getStationImage();

		if (typeof (google) == "undefined") {
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.onload = function() {
				viewModel.tryToInitMap();
			}
			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=onMapLoaded';
			head.appendChild(script);
		} else {
			google.maps.event.addDomListener(window, 'load', viewModel.getPosition());
		}
		
		if (viewModel.thisStation() != undefined && viewModel.thisStation().services != undefined) {
			viewModel.e(viewModel.thisStation().services.substring(0, 1) == 'E');
			viewModel.s(viewModel.thisStation().services.substring(1, 2) == 'S');
			viewModel.a(viewModel.thisStation().services.substring(2, 3) == 'A');
			viewModel.d(viewModel.thisStation().services.substring(3, 4) == 'D');
			viewModel.l(viewModel.thisStation().services.substring(4, 5) == 'L');
			viewModel.c(viewModel.thisStation().services.substring(10, 11) == 'C');
			viewModel.s(viewModel.thisStation().services.substring(11, 12) == 'A');
			viewModel.m(viewModel.thisStation().services.substring(12, 13) == 'M');
		}

	});

})();