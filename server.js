var express = require('express');
var app = express();
const { lunchbox } = require('./model');

const minPrice = 7;
const maxPrice = 20;

const nextWeekBudget = (budget) => {
  const price = [];
  let leftover = budget;
  while (price.length < 5) {
    // get a random price
    const newPrice = Math.random() * (maxPrice * 0.8 - minPrice) + minPrice;
    // check if the budget still has space for it
    if ((leftover - newPrice) > minPrice) {
      leftover = leftover - newPrice;
      price.push(Math.floor(newPrice * 100) / 100);
    } else {
      // well, we still gotta eat...
      price.push(minPrice);
    }
  }
  // return random prices for each of the weekdays
  return price;
}

const calculateFeatures = (budget) => {
  const features = [];
  const prices = nextWeekBudget(budget);
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    features.push([prices[i], date.getDay(), date.getDate(), date.getMonth() + 1, 0]);
  }
  return features;
}

app.get('/mealplan', function (request, response) {
  if (request.query) {
    const { budget, seed, maxFeatures, nEstimators} = request.query;
    const features = calculateFeatures(budget);
    const params = {
      options: {
          seed: parseInt(seed),
          maxFeatures: parseFloat(maxFeatures),
          replacement: true,
          nEstimators: parseInt(nEstimators),
      },
      features: features,
    };
    // get predictions for given parameters
    lunchbox(params).then((result) => {
      console.log('Recipes ready!', result.prediction);
      // sending back predictions to front end
      response.send(result);
    });
  }

});

app.listen(8080, function () {
  console.log('Server has started listening on port 8080.');
});

app.use(express.static('src'));
