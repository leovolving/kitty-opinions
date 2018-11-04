'use strict';

var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
var foursquareSearchUrl = 'https://api.foursquare.com/v2/venues/search';
var image = '';
var venue;
var infoCounter = 0;

//data for preset buttons
//this data can be changed if different preset options are preferred
var buttons = [
  {
    class: '40f86c00f964a520bd0a1fe3',
    content: 'Disneyland'
  },
  {
    class: '416dc180f964a5209b1d1fe3',
    content: 'Space Needle'
  },
  {
    class: '3fd66200f964a520ddf01ee3',
    content: 'Yankee Stadium'
  }];

function displayButtons() {
  var buttonsHTML = '';
  buttons.forEach(function(item) {
    buttonsHTML += '<div class="preset-buttons-entry"><button type="submit" class="' +
  item.class + '" data-fancybox data-src="#fancybox-container">' +
  item.content + '</button></div>';
  });
  $('.buttons').html(buttonsHTML);
}

function getMoreInfo() {
  $('main').on('click', '.more-info', function(e) {	
    e.preventDefault();
    infoCounter++;
    $('.more-info-container').slideToggle();
    if (infoCounter % 2 === 1) {
      $('.more-info').text('Hide');
      $('.more-info-container').attr('aria-hidden', 'false');
    }
    else {
      $('.more-info').text('What?');
      $('.more-info-container').attr('aria-hidden', 'true');
    }
  });
}

function searchSubmit() {
  $('.search-form').submit(function(e) {
    e.preventDefault();
    var searchItem = $('input[name=searchItem]');
    var location = $('input[name=searchLocation]');
    getApiSearch(foursquareSearchUrl, searchItem.val(), location.val(), displaySearchResults);
    searchItem.val('');
    location.val('');
  });
}

function searchFail() {
  return '<p id="search-fail">No results. Check your spelling, human.</p>' +
  '<a href="http://thecatapi.com/?id=75a" target="blank">' +
  '<img id="search-fail-image" src="http://thecatapi.com/api/images/get?id=75a"></a>';
}

function getApiSearch(url, searchItem, location, callback) {
  var query = {
    url: url,
    data: {
      client_id: '0A31O4JMRBGBWYFEXCZNR3FRPGMHB11NCUMWC0GT0XQLAKU0',
      client_secret: 'FPRGSH34PX12SRNAWXJTHGQYUZFP31ZHA5NRWMIMDBKTOK11',
      query: searchItem,
      near: location,
      limit: 6,
      v: 20170401,
      m: 'foursquare'
    },
    success: callback,
    error: function() {
      $('.search-results').html(searchFail()).hide().slideDown('3s');
    }
  };
  $.ajax(query);
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
    });
  }
  //runs if search yielded no results
  else {
    searchResults += searchFail();
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
  };
  $.getJSON(url, query, callback);
}

function getQuotes(callback) {
  var query = {
    url: 'https://ron-swanson-quotes.herokuapp.com/v2/quotes',
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(query);
}

function getCatImage(callback) {
  var query = {
    url: 'https://thecatapi.com/api/images/get?format=html&type=gif',
    dataType: 'html',
    success: callback,
    error: function(text) {
      image = text.responseText;
      return image;
    }
  };
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
 venue.name + ' has ';
  if (venue.rating) {
    quoteHTML += 'a rating of ' + venue.rating +
  '/10 - Whatever.';
  }
  else {
    quoteHTML += 'not been rated. Figures.';
  }
  quoteHTML += ' ' + data[0] + '</p>';
  $('.quote').html(quoteHTML);
}

function displayApiData(data) {
  venue = data.response.venue;
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
    });
  }
  //runs if location had no photos	
  else {
    results += '<p>No photos :(</p>';
  }
  $('.results').html(results);
}

function apiButtonDetails() {
  $('.js-buttons').on('click', 'button', function(e) {
    e.preventDefault();
    image = getCatImage(catImageMaker);	
    //gets location ID which is needed to get API data
    foursquareUrl += this.className;
    getApiData(foursquareUrl, displayApiData);
    foursquareUrl = 'https://api.foursquare.com/v2/venues/';
  });
}

$(function() {
  displayButtons();
  getMoreInfo();
  searchSubmit();
  apiButtonDetails();
});