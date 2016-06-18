$(document).on('pageshow', function(e) {

	// Track page navigation
	// var path = $.url().fsegment().join('/');
	// path = (path == '') ? 'index.html' : path;

}).on('deviceready', function() {

	try {
		navigator.geolocation.getCurrentPosition(function(pos) {
		}, function(err) {
		}, {
			timeout : 10000,
			enableHighAccuracy : true
		});
	} catch (e) {
		console.log(e.message);
	}

	try {
		setTimeout(function() {
			navigator.splashscreen.hide();
		}, 100);
	} catch (e) {
		console.log(e.message);
		// TODO: handle exception
	}

	try {
		// data.devicePlatform = device.platform;
		this.addEventListener("backbutton", function(e) {
			if ($.mobile.activePage.is('#index')) {
				e.preventDefault();
				navigator.app.exitApp();
			} else if ($.mobile.activePage.is('#map') || $.mobile.activePage.is('#offers') || $.mobile.activePage.is('#petro') || $.mobile.activePage.is('#social')) {
				$.mobile.changePage('../../index.html', {
					reverse : true
				});
			} else {
				navigator.app.backHistory();
			}
		}, false);

	} catch (e) {
		// alert('err deviceready ' + e);
		console.log('err deviceready ' + e);
	}

	// setTimeout(function() {

	// }, 4000);

});

$(document).on('focus', 'input', function() {
	// $.mobile.activePage.find("div[data-role='footer']").hide();
	$.mobile.silentScroll(0);
});

$(document).on('blur', 'input', function() {
	// $.mobile.activePage.find("div[data-role='footer']").show();
	$.mobile.silentScroll(0);
});

$(document).on('mobileinit', function() {
	try {
		// Inicialización de app
		$.extend($.mobile, {
			defaultPageTransition : 'slide',
			defaultDialogTransition : 'none',
			pushStateEnabled : false,
		// phonegapNavigationEnabled : true
		});

		$.mobile.buttonMarkup.hoverDelay = 100;

		loadInitData();

	} catch (err) {
		console.log(err);
	}

});

$.fn.serializeObject = function() {
	try {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	} catch (err) {
		console.log(err.message);
		console.log(err.stack);
	}
};

function hideLoading() {

	// setTimeout(function() {
	$.mobile.loading('hide');
	// }, 3000);

}

function showMessage(text, duration, hideLoading) {

	$.mobile.loading("show", {
		html : text,
		textonly : hideLoading || true,
		textVisible : true,
		theme : 'b'
	});

	setTimeout(function() {
		$.mobile.loading('hide');
	}, duration || 3000);
}

function showMsgText(text, duration, hideLoading) {
	$.mobile.loading("show", {
		html : text,
		textonly : hideLoading == undefined ? true : hideLoading,
		textVisible : true,
		theme : 'b'
	});

	setTimeout(function() {
		$.mobile.loading('hide');
	}, duration || 3000);
}

function showMsgLoading(text) {
	text = text == '' || text == undefined ? 'Consultando' : text;
	$.mobile.loading("show", {
		text : text,
		textonly : false,
		textVisible : true,
		theme : 'b'
	});
}

function showMsgDialog(text, title, callback) {

	try {
		navigator.notification.alert(text, callback, title == undefined ? 'Mensaje' : 'title');
	} catch (e) {
		alert(text);
	}
}

function showMsgTextClose(text) {

	$.mobile.loading("show", {
		html : text + '<br><div class="closeMessageLink"><a href="#" onclick="hideMsg()";>Cerrar</a></div>',
		textonly : true,
		textVisible : true,
		theme : 'b'
	});

}

function hideMsg() {
	$.mobile.loading("hide");
}

function loadInitData() {

	// search range
	if (localStorage.searchRange == undefined) {
		localStorage.setItem('searchRange', '10');
	}
	if (localStorage.sendNotifications == undefined) {
		localStorage.setItem('sendNotifications', '0');
	}

}

function getDestinationType() {
	if (appData.cameraOptions.destinationType == '') {
		try {
			if (device.platform == 'Android') {
				appData.cameraOptions.destinationType = navigator.camera.DestinationType.FILE_URI;
			} else {
				appData.cameraOptions.destinationType = navigator.camera.DestinationType.DATA_URL;
			}
		} catch (e) {
			addToLog(e.message);
		}
	}
	return appData.cameraOptions.destinationType;
}

function refreshCarousel(target, quantity) {
	var carousel = $(target).data('owlCarousel');
	if (carousel == undefined) {
		$(target).owlCarousel({
			navigation : false,
			slideSpeed : 300,
			paginationSpeed : 400,
			singleItem : true,
			autoPlay : 3000
		});
	} else {
		carousel.reinit();
		if (quantity != null) {
			carousel.jumpTo(quantity - 1)
		}
	}
}

function addToLog(textToLog) {
	localStorage.setItem('log', localStorage.log + '<br/>' + textToLog);
}

function onMapLoaded() {
	console.log('ready');
}

function getPlatform() {
	try {

		if (localStorage.devPlat == undefined) {
			localStorage.setItem('devPlat', device.platform);
			return localStorage.devPlat;
		} else {
			return localStorage.devPlat;
		}

	} catch (e) {
		localStorage.setItem('devPlat', 'undefined');
		return localStorage.devPlat;
	}
}
