const apikey = "b9hQlYxNpnQyCiUXbdxs6U793gjUPZye"

// Define variables for elements in the HTML
const baseCurrencySelect = document.getElementById('base-currency');
const amountInput = document.getElementById('amount');
const targetCurrencySelect = document.getElementById('target-currency');
const convertButton = document.getElementById('convert-button');
const convertedAmountLabel = document.getElementById('converted-amount');
const historicalRatesButton = document.getElementById('historical-rates');
const favoritePairsList = document.getElementById('favorite-currency-pairs');
const savePairButton = document.getElementById('save-pair-button');

// Define variables for API requests
const apiBaseURL = 'https://api.exchangeratesapi.io/latest';
const historicalRatesBaseURL = 'https://api.exchangeratesapi.io';

// Define variables for storing data
let baseCurrency = 'EUR';
let targetCurrency = 'USD';
let exchangeRates = {};

// Populate the currency dropdown menus with options
function populateCurrencyDropdowns() {
  // Make a request to the API to get the latest exchange rates
  fetch(apiBaseURL)
    .then(response => response.json())
    .then(data => {
      exchangeRates = data.rates;
      // Add options to the base currency dropdown menu
      Object.keys(exchangeRates).forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        if (currency === baseCurrency) {
          option.selected = true;
        }
        baseCurrencySelect.appendChild(option);
      });

      document.getElementById("myButton").addEventListener("click", function() {
        let myHeaders = new Headers();
        myHeaders.append("apikey", "b9hQlYxNpnQyCiUXbdxs6U793gjUPZye");

        let requestOptions = {
          method: 'GET',
          redirect: 'follow',
          headers: myHeaders
        };

        fetch("curl --request GET 'https://api.apilayer.com/currency_data/convert?base=USD&symbols=EUR,GBP,JPY&amount=5&date=2018-01-01", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    });

      // Add options to the target currency dropdown menu
      Object.keys(exchangeRates).forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        if (currency === targetCurrency) {
          option.selected = true;
        }
        targetCurrencySelect.appendChild(option);
      });
    })
    .catch(error => console.log(error));
}

// Convert the currency based on user input and the fetched exchange rates
function convertCurrency() {
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;
  const amount = Number(amountInput.value);
  if (isNaN(amount) || amount < 0) {
    convertedAmountLabel.textContent = 'Please enter a valid amount';
    return;
  }
  const apiUrl = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const rate = data.rates[targetCurrency];
      const convertedAmount = amount * rate;
      convertedAmountLabel.textContent = `${convertedAmount.toFixed(2)} ${targetCurrency}`;
    })
    .catch(error => {
      console.error("Error fetching exchange rate data: ", error);
      convertedAmountLabel.textContent = 'Error fetching exchange rate data';
    });
}

// Fetch and display historical exchange rates between the selected currency pair
function showHistoricalRates() {
  // Define the date to fetch historical rates for (hardcoded for now)
  const date = '2022-01-01';
  const url = `${historicalRatesBaseURL}/${date}?base=${baseCurrency}&symbols=${targetCurrency}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const rate = data.rates[targetCurrency];
      historicalRatesButton.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate.toFixed(4)} ${targetCurrency}`;
    })
    .catch(error => console.log(error));
}

// Save the currently selected
function saveFavoritePair() {
    const favoritePair = `${baseCurrency}/${targetCurrency}`;
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = favoritePair;
    button.addEventListener('click', () => {
      const currencies = favoritePair.split('/');
      baseCurrency = currencies[0];
      targetCurrency = currencies[1];
      baseCurrencySelect.value = baseCurrency;
      targetCurrencySelect.value = targetCurrency;
      convertCurrency();
    });
    listItem.appendChild(button);
    favoritePairsList.appendChild(listItem);
  }
  
  // Initialize the app by populating the dropdown menus and attaching event listeners
  function init() {
    populateCurrencyDropdowns();
    convertButton.addEventListener('click', convertCurrency);
    historicalRatesButton.addEventListener('click', showHistoricalRates);
    savePairButton.addEventListener('click', saveFavoritePair);
  }
  
  // Call the init function when the page has loaded
  window.addEventListener('load', init);
  
