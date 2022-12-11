import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countyList = document.querySelector('.country-list');
const countyInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', searchHandler);

function searchHandler(event) {
  event.preventDefault();
  let searchValue = searchInput.value;

  if (searchValue.trim() === '') {
    countyList.innerHTML = '';
    countyInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchValue.trim()).then(result => {
    if (result.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      countyInfo.innerHTML = '';
      countyList.innerHTML = '';
      return;
    } else if (result.length > 1 && result.length <= 10) {
      countyList.insertAdjacentHTML('beforeend', countryListMarkup);
      countyInfo.innerHTML = '';
    }
  });
}

function countryListMarkup({ name, flags }) {
  return `
            <li class='country-list__item'>
              <img class='country-list__flag-img' src='${flags.svg}' alt='${name.official}' width=50/>
              <h2 class='country-list__name-title'>${name.official}</h2
            </li>
            `;
}
