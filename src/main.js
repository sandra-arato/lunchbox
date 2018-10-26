if (document.readyState !== 'loading') {
    ready();
} else {
    document.addEventListener('DOMContentLoaded', ready);
}

function ready() {
  console.log('Heureka!');
  const Http = new XMLHttpRequest();
  const url='http://localhost:8080/mealplan?budget=80';
  Http.open('GET', url);
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
        console.log(meals[i]);
        const li = document.createElement('li');
        li.classList.add(meals[i]);
        list.appendChild(li);
      }
    }

  }
}
