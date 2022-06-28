import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCoutries from './fetchCountries.js';
import { Notify } from 'Notiflix'


const DEBOUNCE_DELAY = 300;
const refs = {
    searchBoxEl: document.querySelector('input#search-box'),
    countryListEl: document.querySelector('.country-list'),
    countryInfoEl: document.querySelector('.country-info'),
}

const { searchBoxEl, countryListEl, countryInfoEl } = refs;

searchBoxEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));


function searchCountry(e) {
    const countryName = e.target.value.trim();

    if (!countryName) {
        clearCountryInfo();
        clearCountryList();
        return;
    }

    fetchCoutries(countryName)
        .then(data => {
            if (data.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (data.length > 2 && data.length <= 10) {
                clearCountryInfo();
                countryListEl.innerHTML = showCountriesListMarkup(data);
            } else if (data.length === 1) {
                clearCountryList();
                countryInfoEl.innerHTML = showCountryInfoMarkup(data);
            }
        })
        .catch(err => {
            console.log(err);
            Notify.failure('Oops, there is no country with that name');
        });

        
   
}

function showCountryInfoMarkup(data) {
    return data
        .map(({ name, flags, capital, population, languages }) => {
        return `<div class="country-info__thumb">
                    <div class="image__container">
                        <img src="${flags.svg}" class="country-info__image" alt="Flag of ${name.official}">
                    </div>
                    <p class="country-list__text">${name.official}</p>
                </div>
                <div class="country-info__content">
                    <p><span>Capital:</span> ${capital}</p>
                    <p><span>Population:</span> ${population}</p>
                    <p><span>Languages:</span> ${Object.values(languages).join(',')}</p>
                </div>`
        })
        .join('');
}

function showCountriesListMarkup(data) {
    return data
        .map(({ name, flags }) => {
            return `<li class="country-list__item">
                        <div class="image__container">
                            <img src="${flags.svg}" class="country-list__image" alt="Flag of ${name.official}">
                        </div>
                        <p class="country-list__text">${name.official}</p>
                    </li>`
        })
        .join('');
}


function clearCountryList() {
     refs.countryListEl.innerHTML = '';
}

function clearCountryInfo() {
    refs.countryInfoEl.innerHTML = '';
}


