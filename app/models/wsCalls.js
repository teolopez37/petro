(function() {
	'use strict';
	window.callServiceSoap = function(data) {
		var url = config.wsUrl + data.service;
		var methodName = 'Execute';
		$.soap({
			url : url,
			method : methodName,
			data : data.data,
			success : function(soapResponse) {
				try {
					var x2js = new X2JS();
					var response = x2js.xml_str2json(soapResponse);
					data.success(response);
				} catch (e) {
					console.log(e);
					data.success(null);
				}

			},
			error : function(SOAPResponse) {
				// debugger;
				data.error(SOAPResponse)
				// show error
			}
		});

	};

	window.callServiceSoap1 = function(data) {
		var url = config.wsUrl + data.serviceUrl;
		// debugger;

		var xmlhttp = new XMLHttpRequest();

		// xmlhttp.open('POST',
		// 'http://190.152.15.47:8090/ESMOVILJE/servlet/com.esmovil.awsobtenerestacionesciudad',
		// true);
		xmlhttp.open('POST', url, true);

		var sr = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsdlns="ESMOVIL" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tns="ESMOVIL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ><SOAP-ENV:Body><tns:'
				+ data.service + '.Execute xmlns:tns="ESMOVIL">' + data.parameters + '</tns:' + data.service + '.Execute></SOAP-ENV:Body></SOAP-ENV:Envelope>'

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					try {
						var x2js = new X2JS();
						var response = x2js.xml_str2json(xmlhttp.responseText);
						data.success(response);
						// alert(xmlhttp.responseText);
					} catch (e) {
						console.log(e);
						data.error(null);
					}

					// alert('done use firebug to see response');

				}
			}
		}
		// Send the POST request
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send(sr);
	};

	window.callServiceSoap2 = function(data) {
		try {

			var url = 'http://107.170.54.69/JAX-WS-Tomcat/sayhello';

			var xmlhttp = new XMLHttpRequest();

			xmlhttp.open('POST', url, true);

			var sr = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.enterprise.javacodegeeks.com/"><soapenv:Header/><soapenv:Body><ws:printMessage/></soapenv:Body></soapenv:Envelope>'

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						try {
							var x2js = new X2JS();
							var response = x2js.xml_str2json(xmlhttp.responseText);
							data.success(response);
						} catch (e) {
							console.log(e);
							data.success('');
						}
					}
				}
			}
			// Send the POST request
			xmlhttp.setRequestHeader('Content-Type', 'text/xml');
			xmlhttp.send(sr);
		} catch (e) {
			data.success('');
		}
	};

	window.callService = function(data) {

		var url = config.wsUrl + data.service;
		var type = data.type == undefined ? 'GET' : data.type;

		return $.ajax({
			url : url,
			contentType : "text/xml",
			dataType : "xml",
			type : "POST",
			data : data.data,
		}).done(function(response) {
			try {
				var x2js = new X2JS();
				var response = x2js.xml_str2json(response);
				data.success(response);
			} catch (e) {
				// debugger;
				console.log(e);
				data.success(null);
			}

		}).fail(function(error) {
			if (error.status == '404') {
				showMsgText('Servicios abajo', 2000);
			}
			data.error(error);
		});

	};

})(jQuery);

function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) {// element
		// do attributes
		if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) {// text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName.substring(item.nodeName.indexOf(":") + 1).replace('#', '');
			if (typeof (obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof (obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};