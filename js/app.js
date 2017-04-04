var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
var foursquareSearchUrl = 'https://api.foursquare.com/v2/venues/search';

var buttons = [
	{
		class: 'six-flags',
		content: 'Six Flags'
	},
	{
		class: 'ush',
		content: 'Universal Studios Hollywood'
	},
	{
		class: 'hwof',
		content: 'Hollywood Walk of Fame'
	},
	{
		class: 'smb',
		content: 'Santa Monica Beach'
	},
	{
		class: 'lalive',
		content: 'LA Live'
	},
	{
		class: 'knotts',
		content: "Knott's Berry Farm"
	},
	{
		class: 'disneyland',
		content: 'Disneyland'
	},
	{
		class: 'dca',
		content: 'Disney California Adventure'
	}];

function displayButtons() {
	var buttonsHTML = '';
	buttons.forEach(function(item) {
		buttonsHTML += '<button type="submit" class="' +
		item.class + '" data-fancybox data-src="#fancybox-container">' +
		item.content + '</button><br>'
	})
	$('.buttons').html(buttonsHTML);
}

function searchSubmit() {
	$('.search-form').submit(function(e) {
		e.preventDefault();
		var searchItem = $('input[name=searchItem]').val();
		var location = $('input[name=searchLocation]').val();
		getApiSearch(foursquareSearchUrl, searchItem, location, displaySearchResults);
	})
}

function getApiSearch(url, searchItem, location, callback) {
	var query = {
		client_id: '0A31O4JMRBGBWYFEXCZNR3FRPGMHB11NCUMWC0GT0XQLAKU0',
		client_secret: 'FPRGSH34PX12SRNAWXJTHGQYUZFP31ZHA5NRWMIMDBKTOK11',
		query: searchItem,
		near: location,
		limit: 10,
		v: 20170401,
		m: 'foursquare'
	}
	$.getJSON(url, query, callback);
}

function displaySearchResults(data) {
	console.log(data);
	var searchResults = '';
	data.response.venues.forEach(function(item) {
		searchResults += '<button type="submit" class="' +
		item.id + '" data-fancybox data-src="#fancybox-container">' +
		item.name + '</button><br>';
	})
	$('.search-results').html(searchResults);
}

function getApiData(url, callback) {
	var query = {
		client_id: '0A31O4JMRBGBWYFEXCZNR3FRPGMHB11NCUMWC0GT0XQLAKU0',
		client_secret: 'FPRGSH34PX12SRNAWXJTHGQYUZFP31ZHA5NRWMIMDBKTOK11',
		v: 20170401,
		m: 'foursquare'
	}
	$.getJSON(url, query, callback)
}

function getQuotes(callback) {
	var query = {
		url: 'https://ron-swanson-quotes.herokuapp.com/v2/quotes',
		dataType: 'json',
		type: 'GET',
	    success: callback
		}
	$.ajax(query);
}

function displayQuote(data) {
	var quoteHTML = '<h3>User Tips/Reviews</h3><p>' +
	'<a href="https://thecatapi.com" target="blank"><img src="https://thecatapi.com/api/images/get?format=src&type=gif"></a>' + 
	data[0] + '</p>';
	$('.quote').html(quoteHTML);
}

function displayApiData(data) {
	console.log(data.response);
	var venue = data.response.venue;
	getQuotes(displayQuote); 
	var results = '';
	results += '<h2>' + venue.name + '</h2>';
	if (venue.photos.groups[0]) {
		venue.photos.groups[0].items.forEach(function(item) {
			results += '<a href="' + item.prefix + '200x200' + item.suffix +
			'" data-fancybox="images"><img src="' + item.prefix + '150x150' + item.suffix + '"></a> ';
		})
	}
	else {
		results += '<p>No photos :(</p>';
	}
	$('.results').html(results);
}

function searchResultDetails() {
	$('.search-results').on('click', 'button', function(e) {
		e.preventDefault();
		foursquareUrl += this.className;
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function disneylandClick() {
	$('.disneyland').click(function(e) {
		e.preventDefault();
		foursquareUrl += '40f86c00f964a520bd0a1fe3';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function dcaClick() {
	$('.dca').click(function(e) {
		e.preventDefault();
		foursquareUrl += '45db8eb5f964a520fd421fe3';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function smbClick() {
	$('.smb').click(function(e) {
		e.preventDefault();
		foursquareUrl += '49e27207f964a52016621fe3';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function laLiveClick() {
	$('.lalive').click(function(e) {
		e.preventDefault();
		foursquareUrl += '4b098edff964a520651923e3';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function ushClick() {
	$('.ush').click(function(e) {
		e.preventDefault();
		foursquareUrl += '4a6cc0f0f964a52088d11fe3';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function hwofClick() {
	$('.hwof').click(function(e) {
		foursquareUrl += '4e86d78f82311e222fb40371';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function sixFlagsClick() {
	$('.six-flags').click(function(e) {
		e.preventDefault();
		foursquareUrl += '4a179fb5f964a5206b791fe3';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

function knottsClick() {
	$('.knotts').click(function(e) {
		e.preventDefault();
		foursquareUrl += '46d71bdef964a520724a1fe3';
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

$(function() {
	displayButtons();
	searchSubmit();
	searchResultDetails();
	disneylandClick();
	dcaClick();
	smbClick();
	laLiveClick();
	ushClick();
	hwofClick();
	sixFlagsClick();
	knottsClick();
})