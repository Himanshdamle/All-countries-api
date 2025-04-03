let count = 0;
const list = document.querySelector("#show-country-list");
const getNumOfCountryCards =
  sessionStorage.getItem("numOfCards") ||
  ((list.clientWidth - 30) / 320) * (window.innerHeight / 250);

let latestApiUsed = "https://restcountries.com/v3.1/all";
const countryWrapper = document.querySelector("#show-country-list");

let allCountriesData = [];

function fetchMorecountryCard(api) {
  fetch(api)
    .then((response) => response.json())
    .then((country) => {
      allCountriesData = country;
      for (let i = 0; i < getNumOfCountryCards; i++) {
        if (count >= country.length) return;
        createCards(country[count]);
        count++;
        sessionStorage.setItem("numOfCards", count);
      }
    })
    .catch((error) => {
      console.error("There was a problem fetching the data:", error);
    });
}

fetchMorecountryCard("https://restcountries.com/v3.1/all");

function createCards(country) {
  const countryCardWrapper = document.createElement("div");
  const countryLink = document.createElement("a");
  countryCardWrapper.classList.add(
    "country-cards",
    "give-border",
    "border-radius"
  );
  countryLink.href = `/country.html?name=${country.name.official}`;
  countryCardWrapper.append(countryLink);

  countryLink.innerHTML = `
  <img src="${country.flags.svg}" alt="${country.name.common}" />

  <section class="country-main-info">
    <h2 class="font-size-large heading">${country.name.common}</h2>

    <div>
      <p class="font-size-mid values-heading">
        Population: <span class="values">${country.population.toLocaleString()}</span>
      </p>
      <p class="font-size-mid values-heading">
        Region: <span class="values">${country.region}</span>
      </p>
      <p class="font-size-mid values-heading">
        Capital: <span class="values">${
          country.capital ? country.capital : "No Capital"
        }</span>
      </p>
    </div>
  </section>
  `;

  countryWrapper.append(countryCardWrapper);
}

window.addEventListener("scroll", (e) => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchMorecountryCard(latestApiUsed);
  }
  sessionStorage.setItem("scrollPosition", window.scrollY);
});
window.addEventListener("load", () => {
  const scroll = sessionStorage.getItem("scrollPosition");
  if (scroll) {
    const interval = setInterval(() => {
      if (document.body.scrollHeight > scroll) {
        window.scrollTo(0, scroll);
        clearInterval(interval);
      }
    }, 50);
  }
});

document.querySelector("#dropdown-region").addEventListener("change", (e) => {
  console.log(e.target.value);
  count = 0;
  countryWrapper.innerHTML = "";
  latestApiUsed = `https://restcountries.com/v3.1/region/${e.target.value}`;
  fetchMorecountryCard(latestApiUsed);
});

document.querySelector("#search-input").addEventListener("input", (e) => {
  clearTimeout(setTimeout);
  const timeout = setTimeout(() => {
    const query = e.target.value.trim();
    if (query === "") {
      count = 0;
      countryWrapper.innerHTML = "";
      latestApiUsed = "https://restcountries.com/v3.1/all";
      fetchMorecountryCard(latestApiUsed);
      return;
    }

    const filteredCountryList = allCountriesData.filter((country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase())
    );

    countryWrapper.innerHTML = "";
    filteredCountryList.forEach((country) => createCards(country));
  }, 300);
});
