

//Grabs the data from the csv file using PapaParse
function parsing() {
  let x = document.getElementById("myFile");
  Papa.parse(x.files[0],
      {header: true, complete: function(results)
      	{
					// left the console.log in just to show user where they are
					// the console.log would be taken	out at the end
      		console.log("Initial parse results:", results.data);
					initArraytoKustomerObj(results.data)
      	}
      });
}

function initArraytoKustomerObj(data) {
  let kustomerFormat = data.map(convertData);
	kustomerFormat.map(uploadCustomers);
}

function convertData(customer) {
  let name = convertName(customer.firstName, customer.lastName);
  let phone = convertPhoneNumber(customer.homePhone, customer.workPhone);
  let email = convertEmail(customer.email);
  let tags = convertTags(customer.customerType);
  let birthday = convertBirthday(customer.birthday)

  let buildObj = {
    ...name,
		...phone,
    ...email,
    ...tags,
    ...birthday
  }
  return buildObj;
}

//functions that convert data to Kustomer format
function convertName(firstName, lastName) {
  return {
    "name": `${firstName} ${lastName}`
  }
}

function convertPhoneNumber(homePhone, workPhone) {
  let phoneObj = {
    "phones": []
  };

  if (homePhone) {
    phoneObj.phones["type"] = "home",
    phoneObj.phones["phone"] = homePhone.replace(/[^a-zA-Z]/g, "")
  }

  if (workPhone) {
    phoneObj.phones["type"]= "work",
    phoneObj.phones["phone"]= workPhone.replace(/[^a-zA-Z]/g, "")
  }

  return phoneObj;
}

function convertEmail(email) {
  let emailObj = {};

  emailObj["emails"] = [
    {
      "type": "home",
      "email": email
    }
  ]

  return emailObj;
}

function convertTags(customerType) {
  return {
    "tags": [customerType]
  }
}


function convertBirthday(birthday){
	let ISObirthday;
	if (birthday) {
		var date = new Date(birthday);
		ISObirthday = date.toISOString();
	}
	  return {
	    "birthdayAt": ISObirthday
	  }
}

//posts data
function uploadCustomers(data){
	let newData = JSON.stringify(data)
  const xhr = new XMLHttpRequest();
	// xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
    }
  });
  xhr.open("POST", `https://cors-anywhere.herokuapp.com/https://api.kustomerapp.com/v1/customers`);
  xhr.setRequestHeader("authorization", `Bearer ${API_KEY}`);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.send(newData);

}


//helpers for birthday
Date.prototype.toISOString = function() {
  return this.getUTCFullYear() +
    '-' + pad(this.getUTCMonth() + 1) +
    '-' + pad(this.getUTCDate()) +
    'T' + pad(this.getUTCHours()) +
    ':' + pad(this.getUTCMinutes()) +
    ':' + pad(this.getUTCSeconds()) +
    '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    'Z';
};

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}
