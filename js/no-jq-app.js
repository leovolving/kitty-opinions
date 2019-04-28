'use strict';

const foursquareVenueUrl = 'https://api.foursquare.com/v2/venues/';
const foursquareSearchUrl = 'https://api.foursquare.com/v2/venues/search';
const fourSquareQuery = {
  client_id: '0A31O4JMRBGBWYFEXCZNR3FRPGMHB11NCUMWC0GT0XQLAKU0',
  client_secret: 'FPRGSH34PX12SRNAWXJTHGQYUZFP31ZHA5NRWMIMDBKTOK11',
  v: 20170401,
  m: 'foursquare'
};

const swansonQuoteUrl = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
const catApiUrl = 'https://api.thecatapi.com/v1/images/search?size=full&mime_types=gif&format=json&order=RANDOM&page=0&limit=1';

const displayPresetLocations = () => {
  let presetHtml = '';
  const presetLocations = [
    {
      id: '40f86c00f964a520bd0a1fe3',
      name: 'Disneyland'
    },
    {
      id: '416dc180f964a5209b1d1fe3',
      name: 'Space Needle'
    },
    {
      id: '3fd66200f964a520ddf01ee3',
      name: 'Yankee Stadium'
    }];
  presetLocations.forEach(location => {
    presetHtml += `
        <div class="preset-buttons-entry">
            ${createLocationButton(location)}
        </div>`;
  });
  document.getElementById('preset-container').innerHTML = presetHtml;
  addEventListenersToClassList('location-button', 'click', displayLocationData);
};

const createLocationButton = location => `
    <button type="submit" class="location-button" id="${location.id}" data-fancybox data-src="#fancybox-container">
        ${location.name}
    </button>`;

const formatQueryParams = (query) => {
  let result = '?';
  for (const key in query) {
    result += `${key}=${query[key]}&`;
  }
  return result;
};

const requestData = (url, query) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    if (query) url += formatQueryParams(query);
    xhr.open('GET', url);
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.send();
  });
};

const displayLocationData = (event) => {
  const locationId = event.target.id;

  const foursquareData = requestData(foursquareVenueUrl + locationId, fourSquareQuery);
  const catGif = requestData(catApiUrl);
  const swansonQuote = requestData(swansonQuoteUrl);

  return Promise.all([foursquareData, catGif, swansonQuote]).then(response => console.log(response));
};

const addEventListenersToClassList = (className, eventType, callback) => {
  const elements = document.getElementsByClassName(className);
  for (let i=0; i<elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

displayPresetLocations();
