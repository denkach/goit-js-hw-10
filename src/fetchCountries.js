import { Notify } from "notiflix";

export default function fetchCoutries(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fetching ${name} failed: ${response.status}`);
            }
            return response.json();
        })
}

