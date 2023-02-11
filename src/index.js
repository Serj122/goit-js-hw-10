import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('input'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  body: document.querySelector('body'),
};

refs.body.style.backgroundImage =
  'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)';

const cleanMarkup = reference => (reference.innerHTML = '');

function onSearch(evt) {
  evt.preventDefault();
  const searchQuery = evt.target.value.trim();

  if (!searchQuery) {
    cleanMarkup(refs.countryList);
    cleanMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(searchQuery)
    .then(response => {
      console.log(response.length);
      if (response.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(response);
    })
    .catch(error => {
      cleanMarkup(refs.countryList);
      cleanMarkup(refs.countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}

const renderMarkup = response => {
  if (response.length === 1) {
    cleanMarkup(refs.countryList);
    const markupInfo = createInfoMarkup(response);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(refs.countryInfo);
    const markupList = createListMarkup(response);
    refs.countryList.innerHTML = markupList;
  }
};

const createListMarkup = response => {
  return response
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const createInfoMarkup = response => {
  return response.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
