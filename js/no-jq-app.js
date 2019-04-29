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

  const foursquareRequest = requestData(foursquareVenueUrl + locationId, fourSquareQuery);
  const catGifRequest = requestData(catApiUrl);
  const swansonRequest = requestData(swansonQuoteUrl);

  return Promise.all([foursquareRequest, catGifRequest, swansonRequest]).then(responses => {
    const venueData = responses[0].response.venue;
    const catGifSrc = responses[1][0].url;
    const swansonQuote = responses[2][0];
    console.log('venueData, catGifSrc, swansonQuote', [venueData, catGifSrc, swansonQuote]);
    document.getElementsByClassName('results')[0].innerHTML = getLocationDetailsHtml(venueData);
    document.getElementsByClassName('quote')[0].innerHTML = getQuoteHtml(venueData, catGifSrc, swansonQuote);
  });
};

const createAddressText = location => location.address || 'address unknown';

const generateLocationPhotosHtml = (photoList) => photoList
  ? photoList.items.map(item => `<a href="${item.prefix}200x200${item.suffix} data-fancybox="images"><img src="${item.prefix}150x150${item.suffix}"></a>`)
  : '<p>No photos :(</p>';

const getLocationDetailsHtml = (venueData) => `
  <h2>${venueData.name}</h2>
  <p>${createAddressText(venueData.location)}, ${venueData.location.city}, ${venueData.location.country}</p>
  ${generateLocationPhotosHtml(venueData.photos.groups[1])}
`;

const createRatingText = rating => rating ? `a rating of ${rating}/10 - Whatever.` : 'not been rated. Figures.';

const getQuoteHtml = (venueData, catGifSrc, swansonQuote) => `
  <h3>Tips/Reviews:</h3>
    <p>
        <img src="${catGifSrc}" alt="">
        ${venueData.name} has ${createRatingText(venueData.rating)} ${swansonQuote}
    </p>`;

const addEventListenersToClassList = (className, eventType, callback) => {
  const elements = document.getElementsByClassName(className);
  for (let i=0; i<elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

const getApiSearch = (searchItem, location) => {
    const query = {
        limit: 6,
        query: searchItem,
        near: location,
        ...fourSquareQuery
    }

    const containerElement = document.getElementsByClassName('search-results')[0]

    return requestData(foursquareSearchUrl, query)
        .then(response => containerElement.innerHTML = generateSearchResultLocationButtons(response.response.venues))
        .catch(e => containerElement.innerHTML = displaySearchFailure())
};

const generateSearchResultLocationButtons = venues => venues.length
    ? console.log('venues', venues)
    : displaySearchFailure();

const displaySearchFailure = () => console.log('oops soomething wnt wrong')

const displaySearchResults = (event) => {
  event.preventDefault();

  const searchItem = document.getElementsByName('searchItem')[0];
  const location = document.getElementsByName('searchLocation')[0];

  getApiSearch(searchItem.value, location.value);
  searchItem.value = '';
  location.value = '';
};

const setupFormListener = () => {
  addEventListenersToClassList('search-form', 'submit', displaySearchResults);
};

displayPresetLocations();
setupFormListener();
