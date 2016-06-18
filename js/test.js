function invokeContacts() {

	getContacts('{"Contacts":[{"Name":"Abraham Tena","Emails":[]},{"Name":"Adriana Chiluisa","Emails":[],"PhoneNumber":[{"Type":"Movil","Value":"+593999891420"}]},{"Name":"Adrián Grasa","Emails":[]},{"Name":"Alejandro Hott","Emails":[]},{"Name":"Alexandra Mariscal","Emails":[]},{"Name":"Anabell Heredia","Emails":[],"PhoneNumber":[{"Type":"Movil","Value":"+593992739430"}]},{"Name":"Andres Perez","Emails":[{"Type":"3","Value":"andres.perez@bayteq.com"}]},{"Name":"Andrés López","Emails":[]},{"Name":"Andrés Peña M","Emails":[]},{"Name":"Andrés Sánchez","Emails":[],"PhoneNumber":[{"Type":"Movil","Value":"+593987807063"}]},{"Name":"Andy","Emails":[]},{"Name":"acamacho@datafast.com.ec","Emails":[{"Type":"3","Value":"acamacho@datafast.com.ec"}]},{"Name":"adres.villarreal@telefonica.com","Emails":[{"Type":"3","Value":"adres.villarreal@telefonica.com"}]},{"Name":"adrian.grasaarrabal@telefonica.com","Emails":[{"Type":"3","Value":"adrian.grasaarrabal@telefonica.com"}]},{"Name":"adriandafer","Emails":[]},{"Name":"adrigrasa@gmail.com","Emails":[{"Type":"3","Value":"adrigrasa@gmail.com"}]},{"Name":"afigari23@gmail.com","Emails":[{"Type":"3","Value":"afigari23@gmail.com"}]},{"Name":"agarces@carcegsa.com","Emails":[{"Type":"3","Value":"agarces@carcegsa.com"}]},{"Name":"aha2005","Emails":[]},{"Name":"alexander marcillo","Emails":[]},{"Name":"alexei.avila@bayteq.com","Emails":[{"Type":"3","Value":"alexei.avila@bayteq.com"}]},{"Name":"andres perez","Emails":[]},{"Name":"andres.villarreal@telefonica.com","Emails":[{"Type":"3","Value":"andres.villarreal@telefonica.com"}]},{"Name":"andres.vollarreal@telefonica.com","Emails":[{"Type":"3","Value":"andres.vollarreal@telefonica.com"}]},{"Name":"andysebmay@gmail.com","Emails":[{"Type":"3","Value":"andysebmay@gmail.com"}]},{"Name":"asfinanzas@pintulac.com.ec","Emails":[{"Type":"3","Value":"asfinanzas@pintulac.com.ec"}]}]}');

}

function getContacts(response) {
	var responseJson = JSON.parse(response);
	// alert(JSON.stringify(responseJson));

	var ul = document.getElementById('contactsList');
	ul.innerHTML = '';
	var newLi = '<h2 class="header cols1"><div><span>Directorio de contactos</span></div></h2>';
	debugger;
	responseJson.Contacts.forEach(function(contact) {
		// alert(JSON.stringify(contact));

		if (contact.Emails != undefined) {
			var emailsLis = '';
		}

		if (contact.PhoneNumber != undefined || contact.Emails != undefined) {

			var emailLis = '';
			var phoneLis = '';
			var contactName = contact.Name;
			var hasContacts = false;

			if (contact.Emails != undefined) {

				contact.Emails.forEach(function(email) {

					if (email != '') {
						emailLis += '<li><a href="javascript://" onclick="document.getElementsByName(\'nombreContacto\')[0].value = \'' + contactName + '\';document.getElementsByName(\'contacto\')[0].value = \'' + email + '\';document.forms[\'frmSeleccionarContacto\'].submit();return false;">';
						emailLis += email;
						emailLis += '</p></a></li>';
					}
				});

			}

			if (contact.PhoneNumber != undefined) {

				contact.PhoneNumber.forEach(function(phone) {

					var phoneText = '';
					try {

						var thisPhone = phone.Value;

						if (thisPhone.startsWith('+5939') || thisPhone.startsWith('+59309') || thisPhone.startsWith('5939') || thisPhone.startsWith('59309')) {

							thisPhone = thisPhone.replace('+5939', '09');
							thisPhone = thisPhone.replace('+59309', '09');
							thisPhone = thisPhone.replace('5930', '0');
							thisPhone = thisPhone.replace('5939', '09');
							thisPhone = thisPhone.substring(0, 10);
							phoneText = thisPhone;
							hasContacts = true;

						}
					} catch (e) {

					}
					if (phoneText != '') {
						phoneLis += '<li><a href="javascript://" onclick="document.getElementsByName(\'nombreContacto\')[0].value = \'' + contactName + '\';document.getElementsByName(\'contacto\')[0].value = \'' + phoneText + '\';document.forms[\'frmSeleccionarContacto\'].submit();return false;">';
						phoneLis += phoneText;
						phoneLis += '</p></a></li>';
					}
				});
			}

			if (hasContacts) {

				newLi += '<li>' + contact.Name + '</li>' + phoneLis + emailLis;
			}

		}
	});

	ul.innerHTML = newLi;
}