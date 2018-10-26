const csvFilePath='./data/choices.csv';
const csv = require('csvtojson');
const ML =  require('ml-random-forest');
const { performance } = require('perf_hooks');

// Classes that will define the expected output
const choices = ['Burger', 'Burrito', 'Cafe', 'Indian', 'Japanese', 'Korean', 'Pizza', 'Salad', 'Thai', 'Vietnamese', 'Wrap'];

// Reading the dataset from CSV
const model = params => {
  return new Promise((resolve, reject) => {
    const mealplan = [];
    csv()
    .fromFile(csvFilePath)
    .then((data)=>{
        const training = [];
        const prediction = [];
        for (let i in data) {
          const { Price, WeekOfDay, Day, Month, Sandra } = data[i];
          // Arranging training set
          training.push([
            parseInt(Price),
            parseInt(WeekOfDay),
            parseInt(Day),
            parseInt(Month),
            parseInt(Sandra)
          ]);
          prediction.push(data[i].Food);
        }
        const perf = performance.now();
        console.log('Data ready, running the model now..');

        // Options coming from the front end
        const { options, features } = params;
        const classifier = new ML.RandomForestClassifier(options);

        classifier.train(training, prediction.map((elem) =>
          choices.indexOf(elem)
        ));
        const timeElapsed = Math.ceil((performance.now() - perf));
        console.log(`Model trained in ${timeElapsed}ms.`);

        const result = classifier.predict(features);
        for (let i = 0; i < result.length; i++) {
          mealplan.push(choices[result[i]]);
        }
        resolve({ prediction: mealplan, time: timeElapsed });
    });
  });
}


exports.lunchbox = model;
