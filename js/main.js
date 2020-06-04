'use strict';

var advertsCount = 8;
var map = document.querySelector('.map');
var mapPinsList = map.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var mapPinWidth = document.querySelector('.map__pin').offsetWidth;
var mapPinHeight = document.querySelector('.map__pin').offsetHeight;

var TITLES = ['Уютное гнездышко для молодоженов', 'Маленькая квартирка рядом с парком', 'Небольшая лавочка в парке', 'Императорский дворец в центре Токио', 'Милейший чердачок', 'Наркоманский притон', 'Чёткая хата', 'Стандартная квартира в центре'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTIONS = ['Великолепный таун-хауз в центре Токио', 'Маленькая чистая квартира на краю парка', 'Великолепная лавочка прямо в центре парка', 'Замечательный дворец в старинном центре города', 'Маленькая квартирка на чердаке', 'У нас есть всё! Шприцы, интернет, кофе', 'У нас тут все ништяк', 'Тут красиво, светло и уютно'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var MAX_PRIXE = 10000;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;
var MIN_COORDINATEX = 1 + mapPinWidth;
var MAX_COORDINATEX = map.offsetWidth - mapPinWidth;
var MIN_COORDINATEY = 130;
var MAX_COORDINATEY = 630;

// функция случайного выбора

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// функция перемешивания массива

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// функция создания массива с объявлениями-объектами

var getAdverts = function (count) {
  var advertsArr = [];

  for (var i = 0; i < count; i++) {
    advertsArr[i] = {
      author: {
        avatar: 'img/avatars/user' + '0' + [i + 1] + '.png'
      },
      offer: {
        title: TITLES[i],
        address: location.x + ', ' + location.y,
        price: getRandomInt(1, MAX_PRIXE),
        type: TYPES[getRandomInt(0, TYPES.length - 1)],
        rooms: getRandomInt(1, MAX_ROOMS),
        guests: getRandomInt(1, MAX_GUESTS),
        checkin: TIMES[getRandomInt(0, TIMES.length - 1)],
        checkout: TIMES[getRandomInt(0, TIMES.length - 1)],
        features: shuffleArray(FEATURES).slice(0, getRandomInt(1, FEATURES.length)),
        description: DESCRIPTIONS[i],
        photos: shuffleArray(PHOTOS).slice(0, getRandomInt(1, PHOTOS.length))
      },
      location: {
        x: getRandomInt(MIN_COORDINATEX, MAX_COORDINATEX),
        y: getRandomInt(MIN_COORDINATEY, MAX_COORDINATEY)
      }
    };
  }

  return advertsArr;
};

// создание массива с объявлениями

var adverts = getAdverts(advertsCount);

// функция создания метки на основе объекта из массива с объявлениями

var renderMapPin = function (advert) {
  var mapPin = mapPinTemplate.cloneNode(true);

  mapPin.style.left = advert.location.x + mapPinWidth / 2 + 'px';
  mapPin.style.top = advert.location.y + mapPinHeight / 2 + 'px';
  mapPin.querySelector('img').src = advert.author.avatar;
  mapPin.querySelector('img').alt = advert.offer.title;

  return mapPin;
};

// функция отрисовки созданных меток на карте

var createDocument = function (arr) {
  var pin = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    pin.appendChild(renderMapPin(arr[i]));
  }

  return mapPinsList.appendChild(pin);
};

// перевод карты в активный режим и отрисовка меток с объявлениями

map.classList.remove('map--faded');
createDocument(adverts);
