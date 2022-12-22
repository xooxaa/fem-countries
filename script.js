//******************************************************************************
// variable and constant declaration
const header = document.querySelector("header");
const results = document.querySelector(".countries");
const detailPage = document.querySelector("#detail-page-infos");
const detailFlag = document.querySelector("#detail-flag");
const filter = document.querySelector(".filter");
const countryDetail = document.querySelector(".country-detail");
const backBtn = document.querySelector(".back-btn");
const searchInput = document.querySelector(".country-input");
const sortSelect = document.querySelector(".sort-select");
const regionsSelect = document.querySelector(".regions-select");
const populationMinSelect = document.querySelector("#populations-min");
const populationMaxSelect = document.querySelector("#populations-max");
const resetButton = document.querySelector(".reset-btn");
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

        if (!country.capital[0]) {
          countries[index].capital = "N/A";
        }

        if (country.currencies) {
          const currs = Object.keys(country.currencies);
          for (curr of currs) {
            countries[index].currencies[currs.indexOf(curr)] =
              country.currencies[curr].name;
          }
        }
      }
      sortByName(countries);
      localStorage.setItem("countries", JSON.stringify(countries));
      console.log("succesfully fetched countries from api", countries);
      fillCountries();
    })
    .catch((err) => {
      console.log(err);
    });
};

// append country cards to DOM
const fillCountries = function () {
  results.innerHTML = "";
  for (let country of countries) {
    const newDivCountry = document.createElement("div");
    const newImgFlag = document.createElement("img");
    const newDivInfo = document.createElement("div");

    newDivCountry.setAttribute("country", country.name);
    newImgFlag.setAttribute("country", country.name);
    newDivInfo.setAttribute("country", country.name);

    newDivCountry.classList.add("country");
    newImgFlag.src = country.flag;
    newDivInfo.classList.add("infos");
    newDivInfo.innerHTML = `
      <h2 country="${country.name}">${country.name}</h2>
      <p country="${country.name}">Population: <span country="${country.name}">${country.population.toLocaleString()}</span></p>
      <p country="${country.name}">Region: <span country="${country.name}">${country.region}</span></p>
      <p country="${country.name}">Capital: <span country="${country.name}">${country.capital}</span></p>
    `;

    newDivCountry.append(newImgFlag);
    newDivCountry.append(newDivInfo);
    results.append(newDivCountry);
  }
};

//******************************************************************************
// sort countries by name
const sortByName = function (data) {
  data.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase

    return nameA.localeCompare(nameB);
  });
};

// sort countries by capital
const sortByCapital = function (data) {
  data.sort((a, b) => {
    const capA = a.capital; // ignore upper and lowercase
    const capB = b.capital; // ignore upper and lowercase

    return capA.localeCompare(capB);
  });
};

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

    return 0;
  });
};

// event listener for sort select
sortSelect.addEventListener("input", () => {
  if (sortSelect.value === "Name") {
    sortByName(countries);
  }

  if (sortSelect.value === "Capital") {
    sortByCapital(countries);
  }

  if (sortSelect.value === "Region") {
    sortByRegion(countries);
  }

  if (sortSelect.value === "Population") {
    sortByPopulation(countries);
  }

  fillCountries();
  filterCountries();
});


//******************************************************************************
// search by name or capital
searchInput.addEventListener("input", () => {
  filterCountries();
});

//******************************************************************************
// filter by region and/or population
const filterCountries = function () {
  // go through all countries and apply hidden class to those who dont match criteria
  for (let countryDiv of results.children) {
    // remove hidden class by default
    countryDiv.classList.remove("hidden");

    //search query
    const q = searchInput.value.toLowerCase();
    //country name
    const name = countryDiv.children[1].children[0].textContent.toLowerCase();
    // copuntry capital
    const capital = countryDiv.children[1].children[3].children[0].textContent.toLowerCase();

    // apply hidden class to those who dont match query
    if (name.indexOf(q) < 0 && capital.indexOf(q) < 0) {
      countryDiv.classList.add("hidden");
    }

    // country region
    const region = countryDiv.children[1].children[2].children[0].textContent;

    // apply hidden class if regions dont match
    if (
      regionsSelect.value &&
      !(region.toLowerCase() === regionsSelect.value.toLowerCase())
    ) {
      countryDiv.classList.add("hidden");
    }

    // country population
    const population = Number(
      countryDiv.children[1].children[1].children[0].textContent
        .replaceAll(".", "")
        .replaceAll(",", "")
    );

    // population cap for min select
    let populationCap = Number(populationMinSelect.value);

    // apply hidden class if population is below min cap
    if (population < populationCap) {
      countryDiv.classList.add("hidden");
    }

    // population cap for max select
    populationCap = Number(populationMaxSelect.value);

    // apply hidden class if population is over max cap
    if (population >= populationCap) {
      countryDiv.classList.add("hidden");
    }
  }
};

// event linsteners for region and population selects
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
// reset all Filters
const resetFilter = function () {
  searchInput.value = "";
  regionsSelect.selectedIndex = 0;
  populationMinSelect.selectedIndex = 0;
  populationMaxSelect.selectedIndex = 0;
  sortSelect.selectedIndex = 0;
};

resetButton.addEventListener("click", () => {

  resetFilter();
  sortByName(countries);
  fillCountries();
});


//******************************************************************************
// clicking on a country reveals detail information and hides filter and countries
results.addEventListener("click", (e) => {
  //check where the click was triggered
  const country = e.target.getAttribute("country");

  if (country !== null) {
    const index = findCountryByName(country);
    detailFlag.src = countries[index].flag;
    detailPage.innerHTML = `
      <h2>${countries[index].name}</h2>
      <p>Official Name: <span>${countries[index].official}</span></p>
      <p>Population: <span>${countries[index].population.toLocaleString()}</span></p>
      <p>Region: <span>${countries[index].region}</span></p>
      <p>Sub Region: <span>${countries[index].subregion}</span></p>
      <p>Capital: <span>${countries[index].capital}</span></p>
      <br />
      <p>Top Level Domain: <span>${countries[index].toplevel}</span></p>
      <p>Currencies: <span>${countries[index].currencies.toString()}</span></p>
      <p>Languages: <span>${countries[index].languages.toString()}</span></p>
      <br />
      <h3>Border Countries:</h3>
      <div class="link-btns">
        <button>Denmark</button>
        <button>Poland</button>
        <button>Czeck Republic</button>
        <button>Austria</button>
        <button>Switzerland</button>
        <button>France</button>
        <button>Luxembourg</button>
        <button>Belgium</button>
        <button>Netherlands</button>
      </div>`;

    //hide results and filter then show detail page
    results.classList.add("hidden");
    filter.classList.add("hidden");
    countryDetail.classList.remove("hidden");
    backBtn.scrollIntoView();
    header.scrollIntoView();
  }
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

const findCountryByName = function (name) {
  for (let country of countries) {
    if (country.name.toUpperCase() === name.toUpperCase()) return countries.indexOf(country);
  }
}



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
resetFilter();
