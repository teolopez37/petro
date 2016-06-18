(function() {
	var $page = $($('script').last()).closest('[data-role="page"]');

	var map;
	var directionsService;
	var directionsDisplay;
	var markers = [];
	var sliderTimeout;

	var viewModel = {

		viewShowed : ko.observable(2), // 1 List, 2 map

		states : ko.observableArray([]),
		cities : ko.observableArray([]),
		stations : ko.observableArray([]),

		filterSuper : ko.observable(false),
		filterExtra : ko.observable(false),
		filterDiesel : ko.observable(false),
		filterEco : ko.observable(false),
		filterLub : ko.observable(false),
		filterStore : ko.observable(false),
		filterAtm : ko.observable(false),
		filterMechanic : ko.observable(false),
		listAll : true,

		selectedRange : ko.observable(localStorage.searchRange),

		currLat : '',
		currLon : '',
		rangeToSearch : localStorage.searchRange,

		selectedState : ko.observable(-1),
		selectedCity : ko.observable(-1),

		isMapExpanded : ko.observable(false),

		openRouteOnMap : function() {

			openStationRoute(this.latitude, this.longitude, viewModel.currLat, viewModel.currLon);

		},

		openMarker : function(markerIndex) {
			google.maps.event.trigger(markers[markerIndex()], 'click');
			viewModel.viewShowed(2);
		},

		toogleExpandMap : function() {
			if (viewModel.isMapExpanded()) {
				$('.map-content').css('position', 'relative').css('top', '').css('left', '').css('right', '').css('bottom', '')
				$('#map-canvas').css('height', $(document).height() - parseInt($('.ui-header').css('height')) - parseInt($('.ui-footer').css('height')) - parseInt($('#selectFilters').css('height')) - parseInt($('.navbarPages').css('height')) - 6);
			} else {
				$('.map-content').css('position', 'absolute').css('top', 0).css('left', 0).css('right', 0).css('bottom', 0)
				$('#map-canvas').css('height', $(document).height() - parseInt($('.ui-header').css('height')) - parseInt($('.ui-footer').css('height')))
			}
			viewModel.isMapExpanded(!viewModel.isMapExpanded());
		},

		applyFilter : function() {

			if (viewModel.filterSuper() || viewModel.filterExtra() || viewModel.filterDiesel() || viewModel.filterEco() || viewModel.filterLub() || viewModel.filterStore() || viewModel.filterAtm() || viewModel.filterMechanic()) {
				viewModel.listAll = false;

				var allStations = appData.currentStations;
				var stationsToShow = [];

				$.each(allStations, function() {
					var s = this.services
					var add = false;
					if (viewModel.filterSuper()) {
						if (s.substring(1, 2) != 'S') {
							return true;
						} else {
							add = true;
						}
					}
					if (viewModel.filterExtra()) {
						if (s.substring(0, 1) != 'E') {
							return true;
						} else {
							add = true;
						}
					}
					if (viewModel.filterDiesel()) {
						if (s.substring(3, 4) != 'D') {
							return true;
						} else {
							add = true;
						}
					}
					if (viewModel.filterEco()) {
						if (s.substring(2, 3) != 'A') {
							return true;
						} else {
							add = true;
						}
					}
					if (viewModel.filterLub()) {
						if (s.substring(4, 5) != 'L') {
							return true;
						} else {
							add = true;
						}
					}
					if (viewModel.filterStore()) {
						if (s.substring(11, 12) != 'A') {
							return true;
						} else {
							add = true;
						}
					}
					if (viewModel.filterAtm()) {
						if (s.substring(10, 11) != 'C') {
							return true;
						} else {
							add = true;
						}
					}
					if (viewModel.filterMechanic()) {
						if (s.substring(12, 13) != 'M') {
							return true;
						} else {
							add = true;
						}
					}
					if (add) {
						stationsToShow.push(this);
					}
				})

				viewModel.stations(stationsToShow);

			} else if (!viewModel.filterSuper() && !viewModel.filterExtra() && !viewModel.filterDiesel() && !viewModel.filterEco() && !viewModel.filterLub() && !viewModel.filterStore() && !viewModel.filterAtm() && !viewModel.filterMechanic()) {
				viewModel.listAll = true;
				viewModel.stations(appData.currentStations);
			}

			viewModel.putStationsOnMap();

		},

		putStationsOnMap : function() {
			viewModel.deleteMarkers();
			$('.station2').css('width', ($(window).width() - 180) + 'px');
			var latLngs = []
			$.each(viewModel.stations(), function() {

				// var urlToOpen = '';
				// if (getPlatform() == 'iOS') {
				// urlToOpen = 'maps://?q=' + this.latitude + ',' +
				// this.longitude + '&mode=d';
				// } else {
				// urlToOpen = 'google.navigation:q=' + this.latitude + ',' +
				// this.longitude + '&mode=d';
				// }

				var bubbleContent = '<div class="ui-block-a bubbleImage"></div><div class="ui-block-b bubbleInfo">' + this.name + '</div><div><a href="#" onclick="openStationInfo(' + this.id + ')">Ver detalles</a><br/><a href="#" onclick="openStationRoute(' + this.latitude + ',' + this.longitude
						+ ',' + viewModel.currLat + ',' + viewModel.currLon + ')");">Ver ruta</a></div>';

				var infowindow = new google.maps.InfoWindow({
					content : bubbleContent
				});

				var thisPosition = new google.maps.LatLng(this.latitude, this.longitude);
				latLngs.push(thisPosition);
				viewModel.addMarker(thisPosition, infowindow);

			});

			var currPosition = new google.maps.LatLng(viewModel.currLat, viewModel.currLon);
			latLngs.push(currPosition);

			var latlngbounds = new google.maps.LatLngBounds();
			$.each(latLngs, function() {
				latlngbounds.extend(this);
			});
			map.setCenter(latlngbounds.getCenter());
			map.fitBounds(latlngbounds);
			map.panToBounds(latlngbounds);
		},

		loadStates : function() {
			dataRequests.getCities().done(function(response) {
				viewModel.states(response);
			}).fail(function(err) {
				console.log(err);
			});
		},

		calculateRoute : function() {

			var targetDestination = new google.maps.LatLng(this.latitude, this.longitude);
			var currentPosition = new google.maps.LatLng(viewModel.currLat, viewModel.currLon);

			var request = {
				origin : currentPosition,
				destination : targetDestination,
				travelMode : google.maps.DirectionsTravelMode["DRIVING"]
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					viewModel.viewShowed(2);
					directionsDisplay.setPanel(document.getElementById("directions"));
					directionsDisplay.setDirections(response);

				} else {
					$("#results").hide();
				}
			});

		},

		getPosition : function() {
			try {
				navigator.geolocation.getCurrentPosition(viewModel.loadStationsByGeo, viewModel.getPositionError, {
					timeout : 10000,
					enableHighAccuracy : true
				});
			} catch (e) {
				console.log(e);
				viewModel.loadStationsByGeo({
					coords : {
						latitude : '-0.2037631',
						longitude : '-78.4944386'
					}
				});
			}
		},

		loadStationsByGeo : function(pos) {

			viewModel.currLat = pos.coords.latitude;
			viewModel.currLon = pos.coords.longitude;

			viewModel.loadMap();

			var parPosition = pos.coords.latitude + ',' + pos.coords.longitude;

			showMsgLoading('Cargando');

			dataRequests.getNearStations({
				latitude : pos.coords.latitude,
				longitude : pos.coords.longitude,
				area : viewModel.rangeToSearch
			}).done(
					function(response) {
						viewModel.stations(response);
						viewModel.deleteMarkers();
						appData.currentStations = response;
						$('.station2').css('width', ($(window).width() - 180) + 'px');
						$.each(viewModel.stations(), function() {

							var bubbleContent = '<div class="ui-block-a bubbleImage"></div><div class="ui-block-b bubbleInfo">' + this.name + '</div><div><a href="#" onclick="openStationInfo(' + this.id + ')">Ver detalles</a><br/><a href="#" onclick="openStationRoute(' + this.latitude + ','
									+ this.longitude + ',' + viewModel.currLat + ',' + viewModel.currLon + ')");">Ver ruta</a></div>';

							var infowindow = new google.maps.InfoWindow({
								content : bubbleContent
							});

							var thisPosition = new google.maps.LatLng(this.latitude, this.longitude);

							viewModel.addMarker(thisPosition, infowindow);

						});

					}).always(function() {
				hideLoading();
			});

		},

		getPositionError : function(err) {
			console.log(err);
			viewModel.loadStationsByGeo({
				coords : {
					latitude : '-0.2037631',
					longitude : '-78.4944386'
				}
			});
		},

		tryToInitMap : function() {
			setTimeout(function() {

				if (google.maps.event == undefined) {
					console.log('event undefined');
					viewModel.tryToInitMap();
				} else {
					google.maps.event.addDomListener(window, 'load', viewModel.getPosition());

				}
			}, 100)
		},

		loadMap : function() {

			var currLocation = new google.maps.LatLng(viewModel.currLat, viewModel.currLon);

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
			var marker = new google.maps.Marker({
				icon : mapMarker,
				position : currLocation,
				map : map,
				title : 'Disponible'
			});

		},

		toggleMapView : function(val) {
			viewModel.viewShowed(val);
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

		},

		addMarker : function(location, infowindow) {

			var markerName = 'marker';

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
				map.setCenter(marker.getPosition());
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

		sliderRelease : function() {
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

	viewModel.selectedState.subscribe(function(currVal) {
		if (currVal != undefined) {
			$.each(viewModel.states(), function() {
				if (this.id == currVal) {
					viewModel.cities(this.cities);
					viewModel.selectedCity('-1');
				}
			});
		}
	});

	viewModel.selectedRange.subscribe(function(currVal) {
		window.clearTimeout(sliderTimeout);
		sliderTimeout = setTimeout(function() {
			viewModel.rangeToSearch = currVal;
			viewModel.loadStationsByGeo({
				coords : {
					latitude : viewModel.currLat,
					longitude : viewModel.currLon
				}
			});
		}, 1000);

	});

	viewModel.selectedCity.subscribe(function(currVal) {
		if (currVal != undefined && currVal != '-1') {
			appData.selectedState = viewModel.selectedState();
			appData.selectedCity = currVal;
			$.mobile.changePage("mapFilters.html");
		}
	});

	$page.on('pageinit', function() {

		ko.applyBindings(viewModel, $page[0]);
		$('.headerText').css('width', ($(window).width() - 60) + 'px');

	}).on('pageshow', function() {
		$('#map-canvas').css('height', $(document).height() - parseInt($('.ui-header').css('height')) - parseInt($('.ui-footer').css('height')) - parseInt($('#selectFilters').css('height')) - parseInt($('.navbarPages').css('height')) - 6);
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
			google.maps.event.addDomListener(window, 'load', viewModel.loadMap());
		}

		viewModel.loadStates();
		viewModel.getPosition();

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

function openStationRoute(thisLat, thisLon, currLat, currLon) {
	var urlToOpen = '';

	if (getPlatform() == 'iOS') {
		// alert('ios');
		try {

			try {
				navigator.geolocation.getCurrentPosition(function(pos) {
					urlToOpen = 'https://www.google.com.ec/maps/dir/' + pos.coords.latitude + ',' + pos.coords.longitude + '/' + thisLat + ',' + thisLon + '/data=!4m2!4m1!3e0?hl=es'
					window.open(urlToOpen, '_system');
				}, function() {
					urlToOpen = 'https://www.google.com.ec/maps/dir/' + +',' + currLon + '/' + thisLat + ',' + thisLon + '/data=!4m2!4m1!3e0?hl=es'
					window.open(urlToOpen, '_system');
				}, {
					timeout : 30000,
					enableHighAccuracy : true
				});
			} catch (e) {
				console.log(e);
				urlToOpen = 'https://www.google.com.ec/maps/dir/' + currLat + ',' + currLon + '/' + thisLat + ',' + thisLon + '/data=!4m2!4m1!3e0?hl=es'
				window.open(urlToOpen, '_system');
			}

		} catch (e) {
			urlToOpen = 'http://maps.apple.com/?saddr=&daddr=' + thisLat + ',' + thisLon;
			window.open(urlToOpen, '_system');
		}

	} else {
		try {
			navigator.geolocation.getCurrentPosition(function(pos) {

				urlToOpen = 'https://www.google.com.ec/maps/dir/' + pos.coords.latitude + ',' + pos.coords.longitude + '/' + thisLat + ',' + thisLon + '/data=!4m2!4m1!3e0?hl=es'
				window.open(urlToOpen, '_system');
			}, function() {
				urlToOpen = 'https://www.google.com.ec/maps/dir/' + currLat + ',' + currLon + '/' + thisLat + ',' + thisLon + '/data=!4m2!4m1!3e0?hl=es'
				window.open(urlToOpen, '_system');
			}, {
				timeout : 10000,
				enableHighAccuracy : true
			});
		} catch (e) {
			console.log(e);
			urlToOpen = 'https://www.google.com.ec/maps/dir/' + currLat + ',' + currLon + '/' + thisLat + ',' + thisLon + '/data=!4m2!4m1!3e0?hl=es'
			window.open(urlToOpen, '_system');
		}

	}

}

Number.prototype.formatMoney = function(c, d, t) {
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};