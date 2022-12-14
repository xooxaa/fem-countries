//******************************************************************************
// variable and constant declaration
const results = document.querySelector(".countries");
let countries = [];

//******************************************************************************
// fetch all countries from https://restcountries.com/v3.1/all
// save results into an object
const fetchCountries = function () {
  fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca3,region,subregion,flag,flags,tld,capital,population,currencies,languages,borders"
  )
    .then((res) => {
      if (!res.ok) throw new Error(`Status Error Code ${res.status}`);

      return res.json();
    })
    .then((data) => {
      for (let country of data) {
        const index = data.indexOf(country);

        countries[index] = {
          name: country.name.common,
          official: country.name.official,
          cca3: country.cca3,
          capital: country.capital[0],
          population: country.population,
          region: country.region,
          subregion: country.subregion,
          toplevel: country.tld[0],
          currencies: [],
          languages: [...Object.values(country.languages)],
          borders: [...country.borders],
        };

        if (country.currencies) {
          const currs = Object.keys(country.currencies);
          for (curr of currs) {
            countries[index].currencies[currs.indexOf(curr)] =
              country.currencies[curr].name;
          }
        }
      }
      console.log(countries);
    })
    .catch((err) => {
      console.log(err);
    });
};

//******************************************************************************
// sort countries by name
// sort countries by populations
// sort countries by capital
// append country cards to DOM
// <div class="country">
//   <img src="./ger.webp" alt="German Flag" />
//   <div class="infos">
//     <h2>Germany</h2>
//     <p>Population: <span>2.738.131</span></p>
//     <p>Region: <span>Europe</span></p>
//     <p>Capital: <span>Berlin</span></p>
//   </div>
// </div>

//******************************************************************************
// search by name or capital
// go through all countries and apply hidden class to those who dont match query

//******************************************************************************
// filter by region
// go through all countries and apply hidden class to those who dont match region
// filter by population
// go through all countries and apply hidden class to those who have less than x inheritants

//******************************************************************************
// event listeners
// debug buttons
const debugFetch = document.querySelector(".debug-fetch");
const debugClear = document.querySelector(".debug-clear");
const debugStore = document.querySelector(".debug-store");
const debugRecall = document.querySelector(".debug-recall");

debugFetch.addEventListener("click", () => {
  fetchCountries();
});

debugClear.addEventListener("click", () => {
  localStorage.removeItem("countries");
});

debugStore.addEventListener("click", () => {
  localStorage.setItem("countries", JSON.stringify(countries));
});

debugRecall.addEventListener("click", () => {
  // JSON.parse(JSON.stringify(nestedArray));
  countries = JSON.parse(localStorage.getItem("countries"));
  console.log(countries);
});

// clicking on a country reveals detail information and hides filter and countries
// back button hides detail information and shows filter and countries

//******************************************************************************
// initialy check if countries are already locally stored then recall else fetch
