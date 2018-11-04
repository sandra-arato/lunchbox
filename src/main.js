const queryParams = {};

if (document.readyState !== 'loading') {
    ready();
} else {
    document.addEventListener('DOMContentLoaded', ready);
}

function setup(budgetInput, textInput, lengthSlider, seedSlider) {
  console.log('Add event listeners');
  // Update params anytime something changes
  budgetInput.addEventListener('change', updateGlobalParams);
  textInput.addEventListener('change', updateGlobalParams);
  lengthSlider.addEventListener('change', updateGlobalParams);
  seedSlider.addEventListener('change', updateGlobalParams);
}

function updateGlobalParams(e) {
  queryParams[e.target.id] = e.target.value;
  const label = document.getElementById(e.target.id + '-value');
  if (label) {
    label.innerHTML = e.target.value;
  }
  return queryParams;
}

function getPredictions() {
    const Http = new XMLHttpRequest();
    const url='http://localhost:8080/mealplan?';
    const params = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');

    Http.open('GET', url + params);
    Http.send();
    Http.onreadystatechange=(e)=>{
      if (Http.response) {
        const res = JSON.parse(Http.response);
        const meals = res.prediction;
        const itemN = meals.length;
        // empty out previous prediction
        const list = document.getElementById('menu');
        list.innerHTML = '';

        for (let i = 0; i < itemN; i++) {
          const li = document.createElement('li');
          li.classList.add(meals[i]);
          list.appendChild(li);
        }
        console.log(res);
        const positives = document.getElementById('truePos');
        positives.innerHTML = '';
        let newContent = 'True positives - ';
        Object.keys(res.truePos).map(item => {
          if (res.truePos[item] > 0) {
            newContent = newContent + `${item}: ${res.truePos[item]} `;
          }
        });
        positives.innerHTML = newContent;
      }

    }
}

function ready() {
  console.log('Heureka!');

  const budgetInput = document.getElementById('budget');
  const maxFeaturesSlider = document.getElementById('maxFeatures');
  const nEstimatorsSlider =  document.getElementById('nEstimators');
  const seedSlider = document.getElementById('seed');

  // updated global value for params
  queryParams.budget = budgetInput.value;
  queryParams.seed = seedSlider.value;
  queryParams.maxFeatures = maxFeaturesSlider.value;
  queryParams.nEstimators = nEstimatorsSlider.value;
  // adding event listeners
  setup(budgetInput, maxFeaturesSlider, nEstimatorsSlider, seedSlider);
  console.log('setup ready');
  console.log(queryParams);
  document.getElementById('predict').addEventListener('click', getPredictions);
  getPredictions(queryParams);


}
