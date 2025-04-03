const countryName = new URLSearchParams(window.location.search).get("name");

const section = document.createElement("section");
section.classList.add("flex");
section.id = "info-section";
document.querySelector("main").append(section);

section.innerHTML = `<div class="loader"></div><h1 class="font-size-large">
      Fetching country details ...
    </h1>`;

function createDetailInfo(countryData) {
  function getBorderCountries() {
    if (!countryData || !countryData.borders) return Promise.resolve([]);

    section.innerHTML = `<div class="loader"></div><h1 class="font-size-large">
          Fetching country border details ...
        </h1>`;
    return Promise.all(
      countryData.borders.map((countryCode) =>
        fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
          .then((res) => res.json())
          .then(
            (borderCountryData) =>
              borderCountryData[0]?.name?.common || "Unknown"
          )
      )
    );
  }

  let htmlStructure = ``;

  getBorderCountries().then((borderCountryName) => {
    if (borderCountryName.length > 0) {
      htmlStructure = borderCountryName
        .map(
          (countryName) => `
                  <a class="values font-size-mid input-type-style give-border border-radius" href="/country.html?name=${countryName}">
                    ${countryName}
                  </a>
                  `
        )
        .join("");
    } else {
      htmlStructure = `<p class="font-size-mid">None of the countries are connected with it.</p>`;
    }

    section.innerHTML = `
    <img class="give-border" src="${countryData.flags?.svg || ""}" 
         alt="${
           countryData.name?.common || "Unknown"
         } flag" id="country-flag" />
  
    <div id="country-details-wrapper">
      <h1 id="country-name" class="font-size-large">
        ${countryData.name?.common || "Unknown"}
      </h1>
  
      <section>
        <div class="flex flex-gap" id="micro-detail">
          <div class="md-items flex">
            <p class="values-heading font-size-mid">
              Native Name:
              <span class="values">
                ${
                  countryData.name?.nativeName
                    ? Object.values(countryData.name.nativeName)[0]?.common ||
                      "Not available"
                    : "Not available"
                }
              </span>
            </p>
            <p class="values-heading font-size-mid">
              Population:
              <span class="values">${
                countryData.population?.toLocaleString() || "Not available"
              }</span>
            </p>
            <p class="values-heading font-size-mid">
              Region:
              <span class="values">${
                countryData.region || "Not available"
              }</span>
            </p>
            <p class="values-heading font-size-mid">
              Sub Region:
              <span class="values">${
                countryData.subregion || "Not available"
              }</span>
            </p>
            <p id="micro-one-info" class="values-heading font-size-mid">
              Capital:
              <span class="values">${
                countryData.capital ? countryData.capital[0] : "Not available"
              }</span>
            </p>
          </div>
          <div class="left-md md-items flex">
            <p class="values-heading font-size-mid">
              Top Level Domain:
              <span class="values">${
                countryData.tld ? countryData.tld.join(", ") : "Not available"
              }</span>
            </p>
            <p class="values-heading font-size-mid">
              Currencies:
              <span class="values">
                ${
                  countryData.currencies
                    ? Object.values(countryData.currencies)[0]?.name ||
                      "Not available"
                    : "Not available"
                }
              </span>
            </p>
            <p class="values-heading font-size-mid">
              Language:
              <span class="values">
                ${
                  countryData.languages
                    ? Object.values(countryData.languages).join(", ")
                    : "Not available"
                }
              </span>
            </p>
          </div>
        </div>
  
        <div class="flex flex-gap" id="border-countries-wrapper">
          <p id="border-p-tag" class="values-heading font-size-mid">
            Border Countries:&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
          <div id="border-countries-list-wrapper">
            <div class="flex flex-gap">
              ${htmlStructure}
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
  });
}

fetch(`
https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((res) => res.json())
  .then((country) => {
    createDetailInfo(country[0]);
  })
  .catch((err) => {
    section.innerHTML = `
    <div id="error-message-box" class="flex">
        <div class="flex">
        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#EA3323"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
    
       <h1 id="error-message" class="font-size-large">
      Failed to fetch country details
    </h1>
    </div>
  
          <button class="flex input-type-style border-radius give-border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path
            d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
          />
        </svg>
        <p id="reload-page-btn" class="font-size-mid">Try reloading this Web Page.</p>
      </button>
      </div>
    `;
    document.querySelector("#reload-page-btn").addEventListener("click", () => {
      location.reload();
    });
  });

document.querySelector("#back-btn").addEventListener("click", () => {
  window.history.back();
});
