let myHeaders = new Headers();
myHeaders.append("apikey", "5ATLKXJcGYzIUEGd36dEqfQAJMB5ACLs");

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders
};

const targetCurrency = document.getElementById("target-currency");
const baseCurrency = document.getElementById("base-currency");

const list = () => {
  fetch(`https://api.apilayer.com/exchangerates_data/latest`, requestOptions)
    .then(response => response.text())
    .then(results => {
      let obj = JSON.parse(results);
      let currencyList = Object.keys(obj.rates);
      currencyList.map(i => {
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        baseCurrency.append(option);
      });
      currencyList.map(i => {
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        targetCurrency.append(option);
      });
    })
    .catch(error => {
      console.log("error", error);
      alert("Something went wrong. Please try again in a few minutes.");
    });
};

const convertAmount = document.getElementById("converted-amount");

const convert = (c1, c2, a) => {
  fetch(`https://api.apilayer.com/exchangerates_data/convert?from=${c1}&to=${c2}&amount=${a}`, requestOptions)
    .then(response => response.text())
    .then(results => (convertAmount.innerText = JSON.parse(results).result))
    .catch(error => {
      console.log("error", error);
      convertAmount.innerText = "Couldn't compare. Try again.";
    });
};

const historyRates = document.getElementById("historical-rates-container");

const history = (c1, c2) => {
  fetch(`https://api.apilayer.com/exchangerates_data/2002-07-26?symbols=${c2}&base=${c1}`, requestOptions)
    .then(response => response.text())
    .then(results => {
      let obj = JSON.parse(results);
      historyRates.innerText = `07/26/2002: 1 ${c1} = ${Object.values(obj.rates)[0]} ${c2}`;
    })
    .catch(error => {
      console.log("error", error);
      historyRates.innerText = "Couldn't compare historical rates. Try again";
    });
};

list();

const convertButton = document.getElementById("convert");

convertButton.addEventListener("click", e => {
  e.preventDefault();
  let amount = document.getElementById("amount");
  convert(baseCurrency.value, targetCurrency.value, amount.value);
  historyRates.innerHTML = "";
});

const historyButton = document.getElementById("historical-rates");

historyButton.addEventListener("click", e => {
  e.preventDefault();
  history(baseCurrency.value, targetCurrency.value);
});

const favoritesButton = document.getElementById("save-favorite");
const favoritePairsButton = document.getElementById("favorite-currency-pairs");

favoritesButton.addEventListener("click", e => {
  e.preventDefault();
  let baseVal = baseCurrency.value;
  let targetVal = targetCurrency.value;
  const newBtn = document.createElement("button");
  favoritePairsButton.append(newBtn);
  newBtn.innerText = `${baseVal}/${targetVal}`;
  newBtn.addEventListener("click", e => {
    e.preventDefault();
    convert(baseVal, targetVal, amount.value);
    baseCurrency.value = baseVal;
    targetCurrency.value = targetVal;
  });
});