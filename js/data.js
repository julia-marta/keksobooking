'use strict';

(function () {

  var ADVERTS_COUNT = 8;
  var MAX_PRICE = 10000;
  var MAX_ROOMS = 5;
  var MAX_GUESTS = 10;
  var MIN_MAP_Y = 130;
  var MAX_MAP_Y = 630;

  var TITLES = ['Уютное гнездышко для молодоженов', 'Маленькая квартирка рядом с парком', 'Небольшая лавочка в парке', 'Императорский дворец в центре Токио', 'Милейший чердачок', 'Наркоманский притон', 'Чёткая хата', 'Стандартная квартира в центре'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var DESCRIPTIONS = ['Великолепный таун-хауз в центре Токио', 'Маленькая чистая квартира на краю парка', 'Великолепная лавочка прямо в центре парка', 'Замечательный дворец в старинном центре города', 'Маленькая квартирка на чердаке', 'У нас есть всё! Шприцы, интернет, кофе', 'У нас тут все ништяк', 'Тут красиво, светло и уютно'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var typesKeys = {
    palace: {
      ru: 'Дворец',
      min: 10000
    },
    flat: {
      ru: 'Квартира',
      min: 1000
    },
    house: {
      ru: 'Дом',
      min: 5000
    },
    bungalo: {
      ru: 'Бунгало',
      min: 0
    }
  };

  var mapPinElement = document.querySelector('.map__pin');
  var mapPinWidth = mapPinElement.offsetWidth;
  var mapPinHeight = mapPinElement.offsetHeight;
  var minCoordinateX = 0 - mapPinWidth / 2;
  var maxCoordinateX = window.main.map.offsetWidth - mapPinWidth / 2;
  var minCoordinateY = MIN_MAP_Y - mapPinHeight;
  var maxCoordinateY = MAX_MAP_Y - mapPinHeight;

  // функция создания массива с объявлениями-объектами

  var adverts = [];

  var getAdverts = function () {
    for (var i = 0; i < ADVERTS_COUNT; i++) {
      adverts.push({
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: TITLES[i],
          address: window.main.getRandomInt(minCoordinateX, maxCoordinateX) + ', ' + window.main.getRandomInt(minCoordinateY, maxCoordinateY),
          price: window.main.getRandomInt(1, MAX_PRICE),
          type: TYPES[window.main.getRandomInt(0, TYPES.length - 1)],
          rooms: window.main.getRandomInt(1, MAX_ROOMS),
          guests: window.main.getRandomInt(1, MAX_GUESTS),
          checkin: TIMES[window.main.getRandomInt(0, TIMES.length - 1)],
          checkout: TIMES[window.main.getRandomInt(0, TIMES.length - 1)],
          features: window.main.shuffleArray(FEATURES).slice(0, window.main.getRandomInt(1, FEATURES.length)),
          description: DESCRIPTIONS[i],
          photos: window.main.shuffleArray(PHOTOS).slice(0, window.main.getRandomInt(1, PHOTOS.length))
        },
        location: {
          x: window.main.getRandomInt(minCoordinateX, maxCoordinateX),
          y: window.main.getRandomInt(minCoordinateY, maxCoordinateY)
        }
      });
    }
  };

  // создание массива с объявлениями

  getAdverts();

  window.data = {
    adverts: adverts,
    typesKeys: typesKeys,
    mapPinWidth: mapPinWidth,
    mapPinHeight: mapPinHeight,
    maxCoordinateY: maxCoordinateY,
    minCoordinateY: minCoordinateY,
    maxCoordinateX: maxCoordinateX,
    minCoordinateX: minCoordinateX
  };
})();
