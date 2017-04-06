var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
var foursquareSearchUrl = 'https://api.foursquare.com/v2/venues/search';
var image = '';

var buttons = [
	{
		class: '4a6cc0f0f964a52088d11fe3',
		content: 'Universal Studios Hollywood'
	},
	{
		class: '4e86d78f82311e222fb40371',
		content: 'Hollywood Walk of Fame (Strip)'
	},
	{
		class: '49e27207f964a52016621fe3',
		content: 'Santa Monica Beach'
	},
	{
		class: '4b098edff964a520651923e3',
		content: 'LA Live'
	},
	{
		class: '40f86c00f964a520bd0a1fe3',
		content: 'Disneyland'
	},
	{
		class: '45db8eb5f964a520fd421fe3',
		content: 'Disney California Adventure'
	}];

function displayButtons() {
	var buttonsHTML = '';
	var counter = 0;
	buttons.forEach(function(item) {
		if (counter % 3 === 0) {
			buttonsHTML += '<div class="row">'
		}
		buttonsHTML += '<div class="col-md-4"><button type="submit" class="' +
		item.class + '" data-fancybox data-src="#fancybox-container">' +
		item.content + '</button></div>'
		if (counter % 3 === 2) {
			buttonsHTML += '</div>'
		}
		counter++;
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
		limit: 6,
		v: 20170401,
		m: 'foursquare'
	}
	$.getJSON(url, query, callback);
}

function displaySearchResults(data) {
	console.log(data);
	var searchResults = '';
	var counter = 0;
	data.response.venues.forEach(function(item) {
		if (counter % 3 === 0) {
			searchResults += '<div class="row">';
		}
		searchResults += '<div class="col-md-4"><button type="submit" class="' +
		item.id + '" data-fancybox data-src="#fancybox-container">' +
		item.name + '</button></div>';
		if (counter % 3 === 2) {
			searchResults += '</div>';
		}
		counter++;
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

function getCatImage(callback) {

	var query = {
		url: "https://thecatapi.com/api/images/get?format=html&type=gif",
		dataType: 'html',
		success: callback,
		error: function(text) {
			image = text.responseText;
			console.log(image);
			return image;
			}
		}
	$.ajax(query);
}

function catImageMaker(text) {
	console.log(text);
	return text;
}

function displayQuote(data) {
	image = getCatImage(catImageMaker);
	console.log(image);
	var quoteHTML = '<h3>User Tips/Reviews</h3><p>' + image + 
	' ' + data[0] + '</p>';
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

function presetDetails() {
	$('.preset-buttons').on('click', 'button', function(e) {
		e.preventDefault();
		foursquareUrl += this.className;
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
	})
}

$(function() {
	displayButtons();
	presetDetails();
	searchSubmit();
	searchResultDetails();
})