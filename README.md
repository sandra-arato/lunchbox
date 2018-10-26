# lunchbox
lunch suggestion service based on past experience

## Basic functionality
I used Random Forests to predict the meal for the next 5 days based on data from the past 12 months. If you run `node index.js` you'll get a basic suggestion for tomorrow's lunch.

## Web interface
As I wanted to tweak the different options for the model, I created a UI for adjusting the parameters. Run `node server.js` to run the server, and visit `http://localhost:8080` to get a suggestion and tweak the features and input parameters.
