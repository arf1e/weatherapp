var $ = require('jquery');

// Переменные:
const ul = $('.cities')[0];
const addInput = $('.controls__text')[0];
const form = $('.controls')[0];
const remvBtn = $('.btn--remove')[0];

// Добавляем новый город в список:
form.addEventListener('submit', function(event) {
  event.preventDefault();
  let city = addInput.value;
  if (city.length > 0) {
    let li = document.createElement('li');
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&APPID=cb5ea26e82a5e02a185b6a887c9a16ac`,
      type: 'GET',
      dataType: 'jsonp',
      success: (data) => {
        createCity(li, ul, data);
        addInput.value = '';
      },
      error: (error) => {
        console.log(`Опачки ${error.message}`);
      }
    });
  }
});

// Удаляем:
ul.addEventListener('click', (evt) => {
  if (evt.target.tagName === 'SPAN') {
    let city = event.target.parentNode;
    $(city).fadeOut(200, function () {
      $(this).remove();
    });
  }
});

// Удаляем вообще всё:
remvBtn.addEventListener('click', (evt) => {
  let cities = $('.city');
  $(cities).each( (i, el) => {
    $(el).fadeOut(200, () => {
      $(el).remove();
    });
  });
});

function createCity (li, ul, data) {
  li.className = 'city'
  li.innerHTML = `<div class="city__info"><h2 class="city__name"> ${data.list[0].name}</h2><img src="http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png"></div>`;
  li.innerHTML += `<div class="city__weather"><strong class="city__temp">${data.list[0].main.temp}°C, ${data.list[0].weather[0].main}</strong></div><span class="city--remove">X</span>`;
  ul.appendChild(li);
  console.log(data);
}


// Данные о ДС:
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// Конструктор/блюпринт с координатами
function QueryCrds (lat,lon) {
  this.lat = lat,
  this.lon = lon
}

// Обрабатываем данные от geolocation:
function success(position) {
  let coords = position.coords;
  let dcCrds = new QueryCrds(coords.latitude, coords.longitude);
  console.log(dcCrds);
  let dcName = $('.city__name--default')[0];
  let dcTemp = $('.city__temp--default')[0];
  $.ajax({
    url: `http://api.openweathermap.org/data/2.5/weather?lat=${dcCrds.lat}&lon=${dcCrds.lon}&units=metric&lang=ru&APPID=cb5ea26e82a5e02a185b6a887c9a16ac`,
    type: 'GET',
    dataType: 'jsonp',
    success: (data) => {
      console.log(data);
      dcName.textContent = data.name;
      dcTemp.textContent = `${data.main.temp} °C, ${data.weather[0].main}`;
      dcName.innerHTML += `<img class="icon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">`;
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function error(err) {
  console.warn('ERROR: ' + err.code + ' ' +  err.message);
};

navigator.geolocation.getCurrentPosition(success, error, options);










