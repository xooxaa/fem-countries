//******************************************************************************
// variable and constant declaration
const header = document.querySelector("header");
const results = document.querySelector(".countries");
const filter = document.querySelector(".filter");
const countryDetail = document.querySelector(".country-detail");
const backBtn = document.querySelector(".back-btn");
const searchInput = document.querySelector(".country-input");
const sortSelect = document.querySelector(".sort-select");
const regionsSelect = document.querySelector(".regions-select");
const populationSelect = document.querySelector(".population-select");
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
          flag: country.flags.png,
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
      localStorage.setItem("countries", JSON.stringify(countries));
      console.log("succesfully fetched countries from api", countries);
      fillCountries();
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
const fillCountries = function () {
  for (let country of countries) {
    const newDivCountry = document.createElement("div");
    const newImgFlag = document.createElement("img");
    const newDivInfo = document.createElement("div");
    // const newH2 = document.createElement("h2");
    // const newPopulation = document.createElement("p");
    // const newPRegion = document.createElement("p");
    // const newCapital = document.createElement("p");
    newDivCountry.classList.add("country");
    newImgFlag.src = country.flag;
    newDivInfo.classList.add("infos");
    newDivInfo.innerHTML = `
      <h2>${country.name}</h2>
      <p>Population: <span>${country.population.toLocaleString()}</span></p>
      <p>Region: <span>${country.region}</span></p>
      <p>Capital: <span>${country.capital}</span></p>
    `;

    newDivCountry.append(newImgFlag);
    newDivCountry.append(newDivInfo);

    results.append(newDivCountry);
  }
};

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
// filter by region and/or population
const filterCountries = function () {
  // go through all countries and apply hidden class to those who dont match criteria
  for (let countryDiv of results.children) {
    countryDiv.classList.remove("hidden");
    const region = countryDiv.children[1].children[2].children[0].textContent;
    const population = Number(
      countryDiv.children[1].children[1].children[0].textContent
        .replaceAll(".", "")
        .replaceAll(",", "")
    );
    if (
      regionsSelect.value &&
      !(region.toLowerCase() === regionsSelect.value.toLowerCase())
    ) {
      countryDiv.classList.add("hidden");
    }
    populationCap = Number(populationSelect.value);
    if (population < populationCap) {
      countryDiv.classList.add("hidden");
    }
  }
};
regionsSelect.addEventListener("change", () => {
  filterCountries();
});
populationSelect.addEventListener("change", () => {
  filterCountries();
});

//******************************************************************************
// event listeners
// debug buttons

// clicking on a country reveals detail information and hides filter and countries
results.addEventListener("click", () => {
  results.classList.add("hidden");
  filter.classList.add("hidden");
  countryDetail.classList.remove("hidden");
  backBtn.scrollIntoView();
  header.scrollIntoView();
});
// back button hides detail information and shows filter and countries
backBtn.addEventListener("click", () => {
  results.classList.remove("hidden");
  filter.classList.remove("hidden");
  countryDetail.classList.add("hidden");
  filter.scrollIntoView();
  header.scrollIntoView();
});

//******************************************************************************
// initialy check if countries are already locally stored then recall else fetch
if (!JSON.parse(localStorage.getItem("countries"))) {
  fetchCountries();
} else {
  countries = JSON.parse(localStorage.getItem("countries"));
  console.log("loaded countries from local storage", countries);
  fillCountries();
}

searchInput.value = "";
regionsSelect.selectedIndex = 0;
populationSelect.selectedIndex = 0;
sortSelect.selectedIndex = 0;
