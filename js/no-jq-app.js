'use strict';

const foursquareUrl = 'https://api.foursquare.com/v2/venues/';
const foursquareSearchUrl = 'https://api.foursquare.com/v2/venues/search';

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
            <button type="submit" class="${location.id}" data-fancybox data-src="#fancybox-container">
                ${location.name}
            </button>
        </div>`;
  });
  document.getElementById('preset-container').innerHTML = presetHtml;
};

displayPresetLocations();
