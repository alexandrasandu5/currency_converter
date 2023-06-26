const host = "api.frankfurter.app";
const fromDom = document.querySelector("#from");
const toDom = document.querySelector("#to");
const convertBtn = document.querySelector("#convert");
const amountDom = document.querySelector("#amount");
const resultDom = document.querySelector(".result");
const swapBtn = document.querySelector(".arrow-icon");
const historyInputFrom = document.getElementById("date-from");
const historyInputTo = document.getElementById("date-to");
const historicalRatesBtn = document.getElementById("historical-rates");
const currencyHistory = document.getElementById("currency-history");
const historyResult = document.getElementById("history-result");

//Get currencies
fetch(`https://${host}/currencies`)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    const currencies = data;
    const currenciesArr = Object.keys(currencies);
    let optionsHTML = "";

    currenciesArr.forEach((currency) => {
      optionsHTML += `<option value="${currency}">${currency}</option>`;
    });

    fromDom.innerHTML = optionsHTML;
    toDom.innerHTML = optionsHTML;
  });

//Convert
convertBtn.addEventListener("click", convert);

function convert(e) {
  const fromCurrency = fromDom.value;
  const toCurrency = toDom.value;
  const amount = amountDom.value;

  //Don't fetch data if currencies are the same
  if (fromCurrency === toCurrency) {
    resultDom.textContent = amount;
    return;
  }

  fetch(
    `https://${host}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      //Check if errors
      if (!data.message) {
        resultDom.textContent = data.rates[toCurrency];
      }
    });
}

//Swap from and to values and display new conversion
swapBtn.addEventListener("click", (e) => {
  const fromCurrency = fromDom.value;
  const toCurrency = toDom.value;

  fromDom.value = toCurrency;
  toDom.value = fromCurrency;

  convert();
});

// Get currencies for historical rates
fetch(`https://${host}/currencies`)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    const currencies = data;
    const currenciesArr = Object.keys(currencies);
    let optionsHTML = "";

    currenciesArr.forEach((currency) => {
      optionsHTML += `<option value="${currency}">${currency}</option>`;
    });

    currencyHistory.innerHTML = optionsHTML;
  });

// Get historical rates
historicalRatesBtn.addEventListener("click", function (e) {
  e.preventDefault();
  historyResult.innerHTML = "";

  fetch(
    `https://${host}/${historyInputFrom.value}..${historyInputTo.value}?to=${currencyHistory.value}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      const dateRates = Object.keys(data.rates);
      dateRates.forEach((date) => {
        // console.log(data.rates[date][currencyHistory.value], date);
        historyResult.insertAdjacentHTML(
          "afterbegin",
          `<li><span class="date">${date}:</span> <span class="value">${
            data.rates[date][currencyHistory.value]
          }</span></li>`
        );
      });
    });
});
