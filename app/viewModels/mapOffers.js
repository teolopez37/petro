(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var map;
	var directionsService;
	var directionsDisplay;
	var markers = [];

	var viewModel = {

		viewShowed : ko.observable(2), // 1 List, 2 map

		offerId : appData.offerToOpen,
		currLat : '',
		currLon : '',
		stations : ko.observableArray([]),

		openMarker : function(markerIndex) {
			google.maps.event.trigger(markers[markerIndex()], 'click');
			viewModel.viewShowed(2);
		},

		getPosition : function() {
			try {
				navigator.geolocation.getCurrentPosition(function(pos) {
					viewModel.loadMap(pos);
				}, viewModel.getPositionError, {
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

		getPositionError : function(err) {
			console.log(err);
			viewModel.loadMap({
				coords : {
					latitude : '-0.2037631',
					longitude : '-78.4944386'
				}
			})
		},

		tryToInitMap : function() {
			setTimeout(function() {

				if (google.maps.event == undefined) {
					console.log('event undefined');
					viewModel.tryToInitMap();
				} else {
					google.maps.event.addDomListener(window, 'load', viewModel.getPosition());

				}
			}, 100);
		},

		getOfferStations : function() {
			showMsgLoading();
			viewModel.stations([]);
			dataRequests.getOfferStations({
				offerId : viewModel.offerId,
			}).done(
					function(response) {
						appData.currentStations = response;
						viewModel.stations(response);
						viewModel.deleteMarkers();
						// response;
						var latLngs = []
						$.each(viewModel.stations(), function() {
							var bubbleContent = '<div class="ui-block-a bubbleImage"></div><div class="ui-block-b bubbleInfo">' + this.name + '</div><div><a href="#" onclick="openStationInfo(' + this.id + ')">Ver detalles</a><br/><a href="#" onclick="window.open(\'google.navigation:q='
									+ this.latitude + ',' + this.longitude + '&mode=d\' , \'_system\');">Ver ruta</a></div>';

							var infowindow = new google.maps.InfoWindow({
								content : bubbleContent
							});

							var thisPosition = new google.maps.LatLng(this.latitude, this.longitude);
							latLngs.push(thisPosition);

							viewModel.addMarker(thisPosition, infowindow);

						});

						var latlngbounds = new google.maps.LatLngBounds();
						$.each(latLngs, function() {
							latlngbounds.extend(this);
						});
						map.setCenter(latlngbounds.getCenter());
						map.fitBounds(latlngbounds);

					}).always(function() {
				hideLoading()
			})

		},

		loadMap : function(pos) {
			var currLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

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

			google.maps.event.addListener(map, 'click', function(event) {
				viewModel.placeMarker(event.latLng);
			});

			viewModel.getOfferStations();

		},

		placeMarker : function(location) {
			viewModel.setAllMap(null);
			var marker = new google.maps.Marker({
				position : location,
				map : map
			});
			markers.push(marker);
		},

		setAllMap : function(map) {
			for ( var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}

			// Para mostrar
			$('#galleryCarousel').show();
			$('#galleryCarousel').animate({
				opacity : 1
			}, 1000)

			// Para ocultar
			$('#galleryCarousel').animate({
				opacity : 0
			}, 1000, function() {
				$('#galleryCarousel').hide();
			})

		},

		toggleMapView : function(val) {
			viewModel.viewShowed(val);
		},

		addMarker : function(location, infowindow) {

			var markerName = 'markerPetro';

			var mapMarker = {
				url : '../../images/' + markerName + '.png',
				size : new google.maps.Size(46, 55),
				origin : new google.maps.Point(0, 0),
				anchor : new google.maps.Point(0, 32)
			};
			var marker = new google.maps.Marker({
				icon : mapMarker,
				position : location,
				map : map,
				title : 'Disponible'
			});

			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map, marker);
			});
			markers.push(marker);
		},

		// Sets the map on all markers in the array.
		setMapOnAll : function(map) {
			for ( var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		},

		// Removes the markers from the map, but keeps them in the array.
		clearMarkers : function() {
			viewModel.setMapOnAll(null);
		},

		// Shows any markers currently in the array.
		showMarkers : function() {
			viewModel.setMapOnAll(map);
		},

		// Deletes all markers in the array by removing references to them.
		deleteMarkers : function() {
			viewModel.clearMarkers();
			markers = [];
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

		$('#map-canvas').css('height', $(document).height() - parseInt($('.ui-header').css('height')) - 6);
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

	});

})();

function openStationInfo(selectedStation) {
	$.each(appData.currentStations, function() {
		if (this.id == selectedStation) {
			appData.currentStation = this;
			return false;
		}
	});
	$.mobile.changePage("stationDetail.html");
}