var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
var foursquareSearchUrl = 'https://api.foursquare.com/v2/venues/search';
var image = '';
var venue;

//data for preset buttons
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
	//counter to monitor placesment of row div's
	var counter = 0;
	buttons.forEach(function(item) {
		//adds new row div for every 3rd item
		if (counter % 3 === 0) {
			buttonsHTML += '<div class="row">'
		}
		buttonsHTML += '<div class="col-md-4"><button type="submit" class="' +
		item.class + '" data-fancybox data-src="#fancybox-container">' +
		item.content + '</button></div>'
		//closes row div tag at before every 3rd row
		if (counter % 3 === 2) {
			buttonsHTML += '</div>'
		}
		counter++;
	})
	$('.buttons').html(buttonsHTML);
	}

function getMoreInfo() {
	$('header').on('click', '.more-info', function(e) {	
		e.preventDefault();
		var info = '<p>Search for any location within Foursquare and get the top 6 results. ' + 
					'Click on a location for more info as well as a "tip/review", ' +
					'which contains a Cat GIF and a Ron Swanson quote.</p>' +
					'<p>This app is for entertainment purposes only. Don\'t know Ron Swanson? Check out this video:</p>' +
					'<iframe src="https://www.youtube.com/embed/SrLZgP-OR6s" frameborder="0" allowfullscreen></iframe>';
		$('#fancybox-about-container').html(info);
		});
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
	var searchResults = '';
	//runs only if search yielded results
	if (data.response.venues.length !== 0) {
		var counter = 0;
		data.response.venues.forEach(function(item) {
			//adds row div to every 3rd item
			if (counter % 3 === 0) {
				searchResults += '<div class="row">';
				}
			searchResults += '<div class="col-md-4"><button type="submit" class="' +
			item.id + '" data-fancybox data-src="#fancybox-container">' +
			item.name + '</button></div>';
			//adds closing row div before every third item
			if (counter % 3 === 2) {
				searchResults += '</div>';
				}
			counter++;
			})
		}
	//runs if search yielded no results
	else {
		searchResults += '<p id="search-fail">No results. Check your spelling, human.</p>' +
		'<a href="http://thecatapi.com/?id=75a" target="blank"><img id="search-fail-image" src="http://thecatapi.com/api/images/get?id=75a"></a>';
		}
	$('.search-results').html(searchResults).hide().slideDown('3s');
	}

function getApiData(url, callback) {
	$('.results').empty();
	$('.quote').empty();
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
			return image;
			}
		}
	$.ajax(query);
	}

function catImageMaker(text) {
	image = text;
	//call for Ron Swanson quote here due to lag in Cat API
	getQuotes(displayQuote); 
	return text;
	}

function displayQuote(data) {
	var quoteHTML = '<h3>Tips/Reviews:</h3><p>' + image + 
	' ' + data[0] + '</p>';
	console.log(venue);
	$('.quote').html(quoteHTML);
	}

function displayApiData(data) {
	var venue = data.response.venue;
	var results = '';
	results += '<h2>' + venue.name + '</h2><p>';
	//adds text 'undefined address' if location doesn't have address
	if (venue.location.address === undefined) {
		results += 'undefined address';
		}
	else {
		results += venue.location.address;
		}
	results +=	', ' + venue.location.city +
		', ' + venue.location.country + '</p>';
	//runs if location has photos	
	if (venue.photos.groups[0]) {
		venue.photos.groups[0].items.forEach(function(item) {
			results += '<a href="' + item.prefix + '200x200' + item.suffix +
			'" data-fancybox="images"><img src="' + item.prefix + '150x150' + item.suffix + '"></a> ';
		})
		}
	//runs if location had no photos	
	else {
		results += '<p>No photos :(</p>';
		}
	$('.results').html(results);
	console.log($('.quote').html());
	}

function apiButtonDetails() {
	$('.js-buttons').on('click', 'button', function(e) {
		e.preventDefault();
		image = getCatImage(catImageMaker);	
		//gets location ID which is needed to get API data
		foursquareUrl += this.className;
		getApiData(foursquareUrl, displayApiData);
		foursquareUrl = 'https://api.foursquare.com/v2/venues/';
		})
	}

$(function() {
	displayButtons();
	getMoreInfo();
	searchSubmit();
	apiButtonDetails();
	})