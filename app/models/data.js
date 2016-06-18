(function($) {

	window.appData = {

		cameraOptions : {
			quality : 50,
			destinationType : ''
		},

		geolocationOptions : {
			timeout : 40000
		},

		defaultErroMsg : 'Estamos teniendo inconvenientes, por favor intenta mas tarde',

		currentStation : {
			cityId : "1",
			distance : 0.948,
			address : "AV.ELOY ALFARO 218 BERLIN",
			id : "117054",
			name : "EST. SERV. ANETA",
			services : "ESAD567890CA34567890",
			phone : "+593 984999880",
			latitude : "-0.195259",
			longitude : "-78.493789"
		},

		offerToOpen : 1,

		currentStations : [],

		selectedState : -1,
		selectedCity : -1,
		
		globalCurrLat : '',
		globalCurrLon : '',

		homeNews : [],

	};

})(jQuery);