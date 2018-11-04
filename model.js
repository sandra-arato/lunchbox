const csvFilePath='./data/choices2.csv';
const csv = require('csvtojson');
const ML =  require('ml-random-forest');
const CM = require('ml-confusion-matrix');
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
        const trueLabel = [];
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
          trueLabel.push(data[i].Food);
        }
        const perf = performance.now();
        console.log('Data ready, running the model now..');

        // Options coming from the front end
        const { options, features } = params;
        console.log(`Model building with params: ${JSON.stringify(options)}`);
        const classifier = new ML.RandomForestClassifier(options);

        classifier.train(training, trueLabel.map((elem) =>
          choices.indexOf(elem)
        ));
        const timeElapsed = Math.ceil((performance.now() - perf));
        console.log(`Model trained in ${timeElapsed}ms.`);
        const result = classifier.predict(features);
        for (let i = 0; i < result.length; i++) {
          mealplan.push(choices[result[i]]);
        }


        // measuring confusion matrix for the Model
        // eg. accuracy and true positives
        const predictedLabel = [];
        for (let j = 0; j < trueLabel.length; j++) {
          const p = classifier.predict([training[j]])[0];
          predictedLabel.push(choices[p]);
        }

        const confusionMatrix = CM.fromLabels(trueLabel, predictedLabel);
        const truePos = choices.map(food => confusionMatrix.getTruePositiveCount(food));
        const truePosLabels = {};
        choices.forEach((key, i) => truePosLabels[key] = truePos[i]);
        console.log(truePosLabels);

        resolve({ prediction: mealplan, time: timeElapsed, truePos: truePosLabels });
    });
  });
}


exports.lunchbox = model;
