import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 500;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(searchHandler, DEBOUNCE_DELAY));

function searchHandler(event) {
  event.preventDefault();
  let searchValue = searchInput.value;

  if (searchValue.trim() === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchValue.trim())
    .then(result => {
      if (result.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        return;
      } else if (result.length > 1 && result.length <= 10) {
        countryList.insertAdjacentHTML(
          'beforeend',
          result.map(res => countryListMarkup(res))
        );
        countryInfo.innerHTML = '';
        return;
      } else if (result.length === 1) {
        countryList.innerHTML = '';
        countryInfo.insertAdjacentHTML(
          'beforeend',
          result.map(res => countryInfoMarkup(res))
        );
        return;
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return error;
    });
}

function countryListMarkup({ name, flags }) {
  return `
            <li class="country-list__item">
              <img class="country-list__flag-img" src="${flags.svg}" alt="${name.official}" width="50"/>
              <h2 class="country-list__name-title">${name.official}</h2>
            </li>
            `;
}

function countryInfoMarkup({ name, flags, capital, population, languages }) {
  return `
  <div class="name-container">
    <img class="country-info__flag-img" src="${flags.svg}" alt="${
    name.official
  }" width="75"/>
    <h2 class="country-info__name-title">${name.official}</h2>
    </div>
    <ul>
    <li>
    <p class="text-info"><span class="text-name">Capital: </span>${capital}</p>
    </li>
    <li>
    <p class="text-info"><span class="text-name">Population: </span>${population}</p>
    </li>
    <li>
    <p class="text-info"><span class="text-name">Languages: </span>${Object.values(
      languages
    )}</p>
    </li>
    </ul>
    
    
    
    `;
}
