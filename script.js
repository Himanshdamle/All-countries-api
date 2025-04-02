let count = 0;
const list = document.querySelector("#show-country-list");
const numOfCards = sessionStorage.getItem("numOfCards");
const getNumOfCountryCards = numOfCards
  ? numOfCards
  : ((list.clientWidth - 30) / 320) * (window.innerHeight / 250);

function fetchMorecountryCard() {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((country) => {
      for (let i = 0; i < getNumOfCountryCards; i++) {
        if (count >= country.length) return;
        createCards(country[count]);
        console.log(i);
        count++;
        sessionStorage.setItem("numOfCards", count);
      }
    })
    .catch((error) => {
      console.error("There was a problem fetching the data:", error);
    });
}

fetchMorecountryCard();

function createCards(country) {
  const countryCardWrapper = document.createElement("div");
  const countryLink = document.createElement("a");
  countryLink.href = `/country.html?name=${country.name.official}`;
  countryCardWrapper.append(countryLink);
  countryCardWrapper.classList.add(
    "country-cards",
    "give-border",
    "border-radius"
  );

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

  document.querySelector("#show-country-list").append(countryCardWrapper);
}

window.addEventListener("scroll", (e) => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchMorecountryCard();
  }
  sessionStorage.setItem("scrollPosition", window.scrollY);
});

window.addEventListener("load", () => {
  const scroll = sessionStorage.getItem("scrollPosition");
  if (scroll) {
    const interval = setInterval(() => {
      console.log("Checking...", document.body.scrollHeight, scroll);

      if (document.body.scrollHeight > scroll) {
        window.scrollTo(0, scroll);
        console.log("Scrolled to:", scroll);
        clearInterval(interval); // Stop checking
      }
    }, 50); // Check every 50ms
  }
});
