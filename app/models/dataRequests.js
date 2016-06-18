(function() {

	'use strict';

	window.dataRequests = {

		getCities : function() {

			var deferred = $.Deferred();

			if (localStorage.states != undefined) {
				var states = JSON.parse(localStorage.states);
				deferred.resolve(states);
			} else {

				var parametersXml = '';

				callServiceSoap1({
					service : 'WSObtenerCiudades',
					serviceUrl : 'com.esmovil.awsobtenerciudades',
					parameters : parametersXml,
					/*
					 * data : { 'Ubicacion' : '-0.75,1.58', 'Slider' : data.area },
					 */
					success : function(response) {
						debugger;
						var currState = -1;
						var states = [];
						var currCities = [];

						var data = response.Envelope.Body["WSObtenerCiudades.ExecuteResponse"].Ciudades["SDTCiudades.SDTCiudad"];
						$.each(data, function(idx, obj) {
							// debugger;

							var thisStateID = obj['ProvinciaId'];

							if (currState != thisStateID) {
								if (states.length > 0) {
									states[states.length - 1].cities = currCities;
								}
								currState = thisStateID;
								states.push({
									id : thisStateID,
									name : obj['ProvinciaNombre'],
								})
								currCities = [];
							}

							currCities.push({
								id : obj['CiudadId'],
								name : obj['CiudadNombre']
							})

						});
						states[states.length - 1].cities = currCities;
						localStorage.setItem('states', JSON.stringify(states))
						deferred.resolve(states);
					},
					error : function(error) {
						debugger;
						deferred.reject(error);
					}
				});

			}
			return deferred.promise();
		},

		getCityStations : function(data) {

			var deferred = $.Deferred();

			var parametersXml = '<tns:Provinciaid>' + data.stateId + '</tns:Provinciaid><tns:Ciudadid>' + data.cityId + '</tns:Ciudadid>'

			callServiceSoap1({
				service : 'WSObtenerEstacionesCiudad',
				serviceUrl : 'com.esmovil.awsobtenerestacionesciudad',
				parameters : parametersXml,
				success : function(response) {
					var data = response.Envelope.Body["WSObtenerEstacionesCiudad.ExecuteResponse"].Gasolineras["Gasolineras.Gasolinera"];
					var arrData = []
					var stations = [];
					if (data != undefined) {
						if (Object.prototype.toString.call(data) != '[object Array]') {
							arrData.push(data);
						} else {
							arrData = data;
						}

						$.each(arrData, function() {
							var position = this.GasolineraUbicacion.split(',');
							var lat = 0;
							var lon = 0;
							if (position.length == 2) {
								lat = position[0];
								lon = position[1];
							}
							stations.push({
								cityId : this.CiudadId,
								distance : this.GasolineraDistancia / 1000,
								address : this.GasolineraDireccion,
								id : this.GasolineraId,
								name : this.GasolineraNombre,
								services : this.GasolineraProductos,
								phone : this.GasolineraTelefono,
								latitude : lat,
								longitude : lon
							});

						});
					}
					deferred.resolve(stations);
				},
				error : function(error) {
					deferred.reject(error);
				}
			});

			return deferred.promise();

		},

		getNearStations : function(data) {
			var deferred = $.Deferred();

			var parametersXml = '<tns:Ubicacion>' + data.latitude + ',' + data.longitude + '</tns:Ubicacion><tns:Slider>' + data.area + '</tns:Slider>';

			callServiceSoap1({
				service : 'WSObtenerEstacionesCercanas',
				serviceUrl : 'com.esmovil.awsobtenerestacionescercanas',
				parameters : parametersXml,
				/*
				 * data : { 'Ubicacion' : '-0.75,1.58', 'Slider' : data.area },
				 */
				success : function(response) {
					var data = response.Envelope.Body["WSObtenerEstacionesCercanas.ExecuteResponse"].Gasolineras["Gasolineras.Gasolinera"];
					var arrData = []
					if (Object.prototype.toString.call(data) != '[object Array]') {
						arrData.push(data);
					} else {
						arrData = data;
					}

					var stations = [];
					$.each(arrData, function() {
						var position = this.GasolineraUbicacion.split(',');
						var lat = 0;
						var lon = 0;
						if (position.length == 2) {
							lat = position[0];
							lon = position[1];
						}
						stations.push({
							cityId : this.CiudadId,
							distance : this.GasolineraDistancia / 1000,
							address : this.GasolineraDireccion,
							id : this.GasolineraId,
							name : this.GasolineraNombre,
							services : this.GasolineraProductos,
							phone : this.GasolineraTelefono,
							latitude : lat,
							longitude : lon
						});

					})
					deferred.resolve(stations);
				},
				error : function(error) {
					// debugger;
					deferred.reject(error);
				}
			});

			return deferred.promise();

		},

		getStationImage : function(data) {
			var deferred = $.Deferred();

			var parametersXml = '<tns:Gasolineraid>' + data.stationId + '</tns:Gasolineraid>';

			callServiceSoap1({
				service : 'WSObtenerEstacion',
				serviceUrl : 'com.esmovil.awsobtenerestacion',
				parameters : parametersXml,
				/*
				 * data : { 'Ubicacion' : '-0.75,1.58', 'Slider' : data.area },
				 */
				success : function(response) {
					var data = response.Envelope.Body["WSObtenerEstacion.ExecuteResponse"].Gasolinera;
					deferred.resolve({
						stationImg : data.GasPathImagen
					});
				},
				error : function(error) {
					debugger;
					deferred.reject(error);
				}
			});

			return deferred.promise();
		},

		getHomeNews : function() {
			var deferred = $.Deferred();

			var parametersXml = '';

			callServiceSoap1({
				service : 'WSObtenerInforme',
				serviceUrl : 'com.esmovil.awsobtenerinforme',
				parameters : parametersXml,
				/*
				 * data : { 'Ubicacion' : '-0.75,1.58', 'Slider' : data.area },
				 */
				success : function(response) {
					var data = response.Envelope.Body["WSObtenerInforme.ExecuteResponse"].Informes['InformeHome.Item'];
					var news = [];
					$.each(data, function() {
						news.push({
							imgUrl : this.NoticiaPathImage,
							// imgUrl :
							// 'http://www.eppetroecuador.ec/wp-content/uploads/2015/10/proximaSemana.jpg',
							url : this.NoticiaURL
						});
					});
					deferred.resolve(news);
				},
				error : function(error) {
					debugger;
					deferred.reject(error);
				}
			});

			return deferred.promise();
		},

		getOffers : function() {
			var deferred = $.Deferred();

			var parametersXml = '';

			callServiceSoap1({
				service : 'WSObtenerPromociones',
				serviceUrl : 'com.esmovil.awsobtenerpromociones',
				parameters : parametersXml,
				success : function(response) {
					var data = response.Envelope.Body["WSObtenerPromociones.ExecuteResponse"].Promociones['SDTPromociones.Item'];
					var arrData = [];
					if (Object.prototype.toString.call(data) != '[object Array]') {
						arrData.push(data);
					} else {
						arrData = data;
					}

					var offers = [];
					$.each(arrData, function() {
						offers.push({
							id : this.PromocionId,
							title : 'Auto limpio para siempre!',
							desc : 'Por cada tanqueada llena tu cupón! y participa en el sorteo de limpieza de tu auto DE POR VIDAAAAA!',
							imgUrl : this.PromocionPathImagen,
							initDate : this.PromocionInicio,
							endDate : this.PromocionFin
						});
					});
					deferred.resolve(offers);
				},
				error : function(error) {
					debugger;
					deferred.reject(error);
				}
			});

			return deferred.promise();
		},

		getOfferStations : function(data) {

			var deferred = $.Deferred();

			var parametersXml = '<tns:Promocionid>' + data.offerId + '</tns:Promocionid>'

			callServiceSoap1({
				service : 'WSObtenerPromoEstacion',
				serviceUrl : 'com.esmovil.awsobtenerpromoestacion',
				parameters : parametersXml,
				success : function(response) {
					var data = response.Envelope.Body["WSObtenerPromoEstacion.ExecuteResponse"].Estaciones["SDTPromoEstacion.Item"];
					var arrData = []
					if (Object.prototype.toString.call(data) != '[object Array]') {
						arrData.push(data);
					} else {
						arrData = data;
					}

					var stations = [];
					$.each(arrData, function() {
						var position = this.GasolineraUbicacion.split(',');
						var lat = 0;
						var lon = 0;
						if (position.length == 2) {
							lat = position[0];
							lon = position[1];
						}
						stations.push({
							offerId : this.PromocionId,
							address : this.GasolineraDireccion,
							id : this.GasolineraId,
							name : this.GasolineraNombre,
							phone : this.GasolineraTelefono,
							latitude : lat,
							longitude : lon
						});

					});
					deferred.resolve(stations);
				},
				error : function(error) {
					deferred.reject(error);
				}
			});

			return deferred.promise();

		},

		getMainData : function() {

			var deferred = $.Deferred();

			var parametersXml = '';

			callServiceSoap2({
				service : 'printMessage',
				serviceUrl : 'com.esmovil.awsobtenerpromoestacion',
				parameters : parametersXml,
				success : function(response) {
					try {
						var status = response.Envelope.Body.printMessageResponse['return'];
						var firstStatus = status.substring(0, 1);
						deferred.resolve(firstStatus == '1');
					} catch (e) {
						deferred.resolve(true);
					}
				},
				error : function(error) {
					deferred.resolve(true);
				}
			});

			return deferred.promise();

		},

		getVideos : function() {
			var deferred = $.Deferred();

			var parametersXml = '';

			callServiceSoap1({
				service : 'WSObtenerVideos',
				serviceUrl : 'com.esmovil.awsobtenervideos',
				parameters : parametersXml,
				success : function(response) {

					var data = response.Envelope.Body["WSObtenerVideos.ExecuteResponse"].Videos['SDVideos.Video'];
					
					var arrData = [];
					if (Object.prototype.toString.call(data) != '[object Array]') {
						arrData.push(data);
					} else {
						arrData = data;
					}
					
					var videos = [];
					$.each(arrData, function() {
						videos.push({
							imgUrl : this.PathImagenUrl,
							order : this.PathOrden,
							title : this.PathTitulo,
							videoUrl : this.PathVideoUrl
						});
					});
					deferred.resolve(videos);
				},
				error : function(error) {
//					debugger;
					deferred.reject(error);
				}
			});

			return deferred.promise();
		},

	}

})(jQuery);