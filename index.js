const csvFilePath='./data/choices.csv';
const csv = require('csvtojson');
const ML =  require('ml-random-forest');
const { performance } = require('perf_hooks');

// Classes that will define the expected output
const choices = ['Burger', 'Burrito', 'Cafe', 'Indian', 'Japanese', 'Korean', 'Pizza', 'Salad', 'Thai', 'Vietnamese', 'Wrap'];

// Reading the dataset from CSV

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

      // Options can be tweaked to improve results
      const options = {
        seed: 11,
        maxFeatures: 2,
        replacement: true,
        nEstimators: 25
      };

      // Pick a classifier, and see how you go.
      const classifier = new ML.RandomForestClassifier(options);

      classifier.train(training, prediction.map((elem) =>
        choices.indexOf(elem)
      ));
      const timeElapsed = Math.ceil((performance.now() - perf));
      console.log(`Model trained in ${timeElapsed}ms.`);

      // Calculate result for tomorrow
      const price = 21;
      const today = new Date();
      today.setDate(today.getDate()+1);

      const result = classifier.predict([[price, today.getDay(), today.getDate(), today.getMonth() + 1, 1]]);
      // const result = classifier.predict([[6, 2, 21,11, 1]]);
      console.log(`Tomorrow's menu is: ${choices[result[0]]}`);
      return result;
  });
