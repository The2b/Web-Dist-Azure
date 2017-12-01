/**
 * @author Thomas Lenz <thomas.lenz96@gmail.com> AS The2b
 * @date 12 October 2017
 * @project Google Maps JS API
 * @file gm-js-game.js
 * @course Web and Dist Programming
 * @semester Fall, 2017
 */

var STARTING_ZOOM = 4;
var DEFAULT_ZOOM = 8;
var ZIP_ZOOM = 10;
var ADDR_ZOOM = 14;
var STATE_ZOOM = 7;
var COUNTY_ZOOM = 9;

var myMap;

if(!window.jQuery) {
	alert("jQuery failed to load; Reload the page, as the page won't owrk as is.");
}

// FFS Why doesn't JS have the simplest array methods...
if(!Array.prototype.countChar) {
	Array.prototype.countChar = function(c) {
		var count = 0;
		for(index = 0; index < this.length; index++) {
			if(this[index] == c) {
				count++;
			}
		}
		return count;
	};
}

function buildMap() {
	myMap = new google.maps.Map(document.getElementById("gMap"), {
		// The following is defined based on the assignment instructions
		center: new google.maps.LatLng(37.0902,-95.7129),
		zoom: STARTING_ZOOM
	});
	
	// Start hybrid view mode
	myMap.setMapTypeId(google.maps.MapTypeId.HYBRID);

	attachEvents();
}

function parseAddress(str) {
	var strTrim = str.trim();
	//var strArray = strTrim.split("");
	//var commaCount = strArray.countChar(",");

	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + strTrim + "&components=country:US" + "&key=" + "AIzaSyB1jIuVAEJsvYsGEN8iJJwegU-tPCu6Yfg";

	return url;
}

function lookupLocation(url) {
	$.ajaxSetup({
		async: false,
		beforeSend: function(xhr) {
			if(xhr.overrideMimeType) {
				xhr.overrideMimeType("application/json");
			}
		}
	});

	var city;
	var state;
	var zip;

	$.getJSON(url, function(data) {
		var obj = data;
		myMap.panTo(obj.results[0].geometry.location);
		if(obj.results[0].types[0] == "postal_code") {
			myMap.setZoom(ZIP_ZOOM);
		}

		else if(obj.results[0].types[0] == "administrative_area_level_1") {
			myMap.setZoom(STATE_ZOOM);
		}

		else if(obj.results[0].types[0] == "administrative_area_level_2") {
			myMap.setZoom(COUNTY_ZOOM);
		}

		else if(obj.results[0].types[0] == "street_address") {
			myMap.setZoom(ADDR_ZOOM);
		}

		else {
			myMap.setZoom(DEFAULT_ZOOM);
		}
		
		for(index = 0; index < data.results[0].address_components.length; index++) {
			if(data.results[0].address_components[index]["types"].indexOf("administrative_area_level_1") >= 0) {
				state = data.results[0].address_components[index].long_name;
			}
			
			else if(data.results[0].address_components[index]["types"].indexOf("locality") >= 0) {
				city = data.results[0].address_components[index].long_name;
			}
			
			else if(data.results[0].address_components[index]["types"].indexOf("postal_code") >= 0) {
				zip = data.results[0].address_components[index].long_name;
			}
		}
		
		document.getElementById("zip").innerHTML = "ZIP: " + zip;
		document.getElementById("city").innerHTML = "CITY: " + city;
		document.getElementById("state").innerHTML = "STATE: " + state;
	});

}

function attachEvents() {
	$("#searchButton").click(function(event) {
		event.preventDefault();
		var searchVal = $("#searchBar").val();
		lookupLocation(parseAddress(searchVal));
	});

	$("#searchBar").submit(function(event) {
		event.preventDefault();
		var searchVal = this.val();
		lookupLocation(parseAddress(searchVal));
	});
}
