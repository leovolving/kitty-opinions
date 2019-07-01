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
      id: '40dcbc80f964a52081011fe3',
      name: 'Wrigley Field'
    }];
  presetLocations.forEach(location => presetHtml += createLocationButton(location));
  document.getElementById('preset-container').innerHTML = presetHtml;
  addEventListenersToClassList('location-button', 'click', displayLocationData);
};

const createLocationButton = location => `
    <button type="submit" class="location-button row-item" id="${location.id}" data-fancybox data-src="#fancybox-container">
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

const clearLocationDetails = (event) => {
  document.getElementsByClassName('results')[0].innerHTML = '';
  document.getElementsByClassName('quote')[0].innerHTML = '';
}

const displayLocationData = (event) => {
  const locationId = event.target.id;

  const foursquareRequest = requestData(foursquareVenueUrl + locationId, fourSquareQuery);
  const catGifRequest = requestData(catApiUrl);
  const swansonRequest = requestData(swansonQuoteUrl);

  return Promise.all([foursquareRequest, catGifRequest, swansonRequest]).then(responses => {
    const venueData = responses[0].response.venue;
    const catGifSrc = responses[1][0].url;
    const swansonQuote = responses[2][0];

    document.getElementsByClassName('results')[0].innerHTML = getLocationDetailsHtml(venueData);
    document.getElementsByClassName('quote')[0].innerHTML = getQuoteHtml(venueData, catGifSrc, swansonQuote);
    addEventListenersToClassList('fancybox-close-small', 'click', clearLocationDetails);
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
  };

  const containerElement = document.getElementsByClassName('search-results')[0];

  return requestData(foursquareSearchUrl, query)
    .then(response => {
      containerElement.innerHTML = generateSearchResultLocationButtons(response.response.venues);
      addEventListenersToClassList('location-button', 'click', displayLocationData);
    }).catch(e => containerElement.innerHTML = displaySearchFailure());
};

const generateOpeningRowDiv = i => i % 2 === 0 ? '<div class="row">' : '';

const generateClosingRowDiv = i => i % 2 === 1 ? '</div>' : '';

const generateSearchResultLocationButtons = venues => {
  if (!venues.length) return displaySearchFailure();
  let result = '';
  venues.forEach((venue, index) => {
    result += `
        ${generateOpeningRowDiv(index)}
          ${createLocationButton(venue)}
        ${generateClosingRowDiv(index)}
    `;});
  return result;
};

const displaySearchFailure = () => `
    <p id="search-fail">No results. Check your spelling, human.</p>
    <a href="http://thecatapi.com/?id=75a" target="blank">
        <img id="search-fail-image" src="http://thecatapi.com/api/images/get?id=75a">
    </a>`;

const displaySearchResults = (event) => {
  event.preventDefault();

  const searchItem = document.getElementsByName('searchItem')[0];
  const location = document.getElementsByName('searchLocation')[0];

  getApiSearch(searchItem.value, location.value);
  searchItem.value = '';
  location.value = '';
};

const toggleMoreInfo = (e) => {
  e.preventDefault();

  const container = document.getElementsByClassName('more-info-container')[0];
  const moreInfoLink = event.target;
  const isContainerHidden = container.getAttribute('aria-hidden') === 'true' ? true : false;

  moreInfoLink.innerText = isContainerHidden ? 'Hide' : 'More Info';
  container.style.display = isContainerHidden ? 'block' : 'none';
  container.setAttribute('aria-hidden', !isContainerHidden);
};

const setupListeners = () => {
  addEventListenersToClassList('search-form', 'submit', displaySearchResults);
  addEventListenersToClassList('more-info-button', 'click', toggleMoreInfo);
};

displayPresetLocations();
setupListeners();
