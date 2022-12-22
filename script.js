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
const populationMinSelect = document.querySelector("#populations-min");
const populationMaxSelect = document.querySelector("#populations-max");
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
const sortByName = function (data) {
  data.sort((a, b) => {
    const nameA = a.name.common.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.common.toUpperCase(); // ignore upper and lowercase

    return nameA.localeCompare(nameB);
  });
};

// sort countries by capital

// sort countries by region
const sortByRegion = function (data) {
  data.sort((a, b) => {
    const regionA = a.region;
    const regionB = b.region;

    if (regionA < regionB) {
      return -1;
    }
    if (regionA > regionB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
};

// sort countries by populations
const sortByPopulation = function (data) {
  data.sort((a, b) => {
    const popA = a.population;
    const popB = b.population;

    if (popA > popB) {
      return -1;
    }
    if (popA < popB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
};



// append country cards to DOM
const fillCountries = function () {
  for (let country of countries) {
    const newDivCountry = document.createElement("div");
    const newImgFlag = document.createElement("img");
    const newDivInfo = document.createElement("div");
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

//******************************************************************************
// search by name or capital
searchInput.addEventListener("input", () => {
  // go through all countries and apply hidden class to those who dont match query
  const q = searchInput.value.toLowerCase();
  if (q) {
    regionsSelect.selectedIndex = 0;
    populationMinSelect.selectedIndex = 0;
    populationMaxSelect.selectedIndex = 0;
    sortSelect.selectedIndex = 0;
  }
  for (let countryDiv of results.children) {
    countryDiv.classList.remove("hidden");
    const name = countryDiv.children[1].children[0].textContent.toLowerCase();
    const capital = countryDiv.children[1].children[3].children[0].textContent.toLowerCase();
    if (name.indexOf(q) < 0 && capital.indexOf(q) < 0) {
      countryDiv.classList.add("hidden");
    }
  }
});

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
      searchInput.value = "";
    }

    let populationCap = Number(populationMinSelect.value);
    if (population < populationCap) {
      countryDiv.classList.add("hidden");
      searchInput.value = "";
    }

    populationCap = Number(populationMaxSelect.value);
    if (population >= populationCap) {
      countryDiv.classList.add("hidden");
      searchInput.value = "";
    }
  }
};
regionsSelect.addEventListener("change", () => {
  filterCountries();
});
populationMinSelect.addEventListener("change", () => {
  filterCountries();
});
populationMaxSelect.addEventListener("change", () => {
  filterCountries();
});

//******************************************************************************
// clicking on a country reveals detail information and hides filter and countries
results.addEventListener("click", () => {
  //check where the click was triggered

  //hide results and filter then show detail page
  results.classList.add("hidden");
  filter.classList.add("hidden");
  countryDetail.classList.remove("hidden");
  backBtn.scrollIntoView();
  header.scrollIntoView();
});

// back button hides detail information and shows filter and countries
backBtn.addEventListener("click", () => {
  //hide detail page then show filter and results
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

// reset filter inputs upon (re-)load
searchInput.value = "";
regionsSelect.selectedIndex = 0;
populationMinSelect.selectedIndex = 0;
populationMaxSelect.selectedIndex = 0;
sortSelect.selectedIndex = 0;

setTimeout(() => {
  console.clear();
  console.log(countries);
}, 1000);
