var foursquareDisneylandUrl = 'https://api.foursquare.com/v2/venues/40f86c00f964a520bd0a1fe3/photos';
var foursquareDcaUrl = 'https://api.foursquare.com/v2/venues/45db8eb5f964a520fd421fe3/photos';
var foursquareSmbUrl = 'https://api.foursquare.com/v2/venues/49e27207f964a52016621fe3/photos';
var foursquareLaLiveUrl = 'https://api.foursquare.com/v2/venues/4b098edff964a520651923e3/photos';
var foursquareUshUrl = 'https://api.foursquare.com/v2/venues/4a6cc0f0f964a52088d11fe3/photos';
var foursquareHwofUrl = 'https://api.foursquare.com/v2/venues/4e86d78f82311e222fb40371/photos';
var fousquareSixFlagsUrl = 'https://api.foursquare.com/v2/venues/4a179fb5f964a5206b791fe3/photos';
var fousquareKnottsUrl = 'https://api.foursquare.com/v2/venues/46d71bdef964a520724a1fe3/photos';

function getApiData(url, callback) {
	var query = {
		client_id: '0A31O4JMRBGBWYFEXCZNR3FRPGMHB11NCUMWC0GT0XQLAKU0',
		client_secret: 'FPRGSH34PX12SRNAWXJTHGQYUZFP31ZHA5NRWMIMDBKTOK11',
		// venue_id: searchItem,
		group: 'venue',
		limit: 9,
		v: 20170401,
		m: 'foursquare'
	}
	$.getJSON(url, query, callback)
}

function displayApiData(data) {
	console.log(data.response);
	var results = '';
	data.response.photos.items.forEach(function(item) {
		results += '<img src="' + item.prefix + '100x100' + item.suffix + '">';
	})
	$('.results').html(results);
}

function disneylandClick() {
	$('.disneyland').click(function(e) {
		e.preventDefault();
		var query = '40f86c00f964a520bd0a1fe3';
		getApiData(foursquareDisneylandUrl, displayApiData);
	})
}

function dcaClick() {
	$('.dca').click(function(e) {
		e.preventDefault();
		var query = '45db8eb5f964a520fd421fe3';
		getApiData(foursquareDcaUrl, displayApiData);
	})
}

function smbClick() {
	$('.smb').click(function(e) {
		e.preventDefault();
		var query = '49e27207f964a52016621fe3';
		getApiData(foursquareSmbUrl, displayApiData);
	})
}

function laLiveClick() {
	$('.lalive').click(function(e) {
		e.preventDefault();
		var query = '4b098edff964a520651923e3';
		getApiData(foursquareLaLiveUrl, displayApiData);
	})
}

function ushClick() {
	$('.ush').click(function(e) {
		e.preventDefault();
		var query = '4a6cc0f0f964a52088d11fe3';
		getApiData(foursquareUshUrl, displayApiData);
	})
}

function hwofClick() {
	$('.hwof').click(function(e) {
		var query = '4e86d78f82311e222fb40371';
		getApiData(foursquareHwofUrl, displayApiData);
	})
}

function sixFlagsClick() {
	$('.six-flags').click(function(e) {
		e.preventDefault();
		var query = '4a179fb5f964a5206b791fe3';
		getApiData(fousquareSixFlagsUrl, displayApiData);
	})
}

function knottsClick() {
	$('.knotts').click(function(e) {
		e.preventDefault();
		var query = '46d71bdef964a520724a1fe3';
		getApiData(fousquareKnottsUrl, displayApiData);
	})
}

$(function() {
	disneylandClick();
	dcaClick();
	smbClick();
	laLiveClick();
	ushClick();
	hwofClick();
	sixFlagsClick();
	knottsClick();
})