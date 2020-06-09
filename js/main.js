'use strict';

var ADVERTS_COUNT = 8;
var MAX_PRIXE = 10000;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;
var MIN_COORDINATEY = 130;
var MAX_COORDINATEY = 630;

var TITLES = ['Уютное гнездышко для молодоженов', 'Маленькая квартирка рядом с парком', 'Небольшая лавочка в парке', 'Императорский дворец в центре Токио', 'Милейший чердачок', 'Наркоманский притон', 'Чёткая хата', 'Стандартная квартира в центре'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTIONS = ['Великолепный таун-хауз в центре Токио', 'Маленькая чистая квартира на краю парка', 'Великолепная лавочка прямо в центре парка', 'Замечательный дворец в старинном центре города', 'Маленькая квартирка на чердаке', 'У нас есть всё! Шприцы, интернет, кофе', 'У нас тут все ништяк', 'Тут красиво, светло и уютно'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var mapPinsList = map.querySelector('.map__pins');
var mapContainer = document.querySelector('.map__filters-container');

var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var mapPinElement = document.querySelector('.map__pin');

var mapPinWidth = mapPinElement.offsetWidth;
var mapPinHeight = mapPinElement.offsetHeight;

var minCoordinateX = 1 + mapPinWidth;
var maxCoordinateX = map.offsetWidth - mapPinWidth;

var cardTemplate = document.querySelector('#card')
.content
.querySelector('.map__card');
var photoTemplate = cardTemplate.querySelector('.popup__photo');

var typesKeys = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

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

var adverts = [];

var getAdverts = function () {

  for (var i = 0; i < ADVERTS_COUNT; i++) {
    adverts.push({
      author: {
        avatar: 'img/avatars/user' + '0' + [i + 1] + '.png'
      },
      offer: {
        title: TITLES[i],
        address: getRandomInt(minCoordinateX, maxCoordinateX) + ', ' + getRandomInt(MIN_COORDINATEY, MAX_COORDINATEY),
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
        x: getRandomInt(minCoordinateX, maxCoordinateX),
        y: getRandomInt(MIN_COORDINATEY, MAX_COORDINATEY)
      }
    });
  }
};

// создание массива с объявлениями

getAdverts();

// функция создания метки на основе объекта из массива с объявлениями

var renderMapPin = function (advert) {
  var mapPin = mapPinTemplate.cloneNode(true);

  mapPin.style.left = advert.location.x - mapPinWidth / 2 + 'px';
  mapPin.style.top = advert.location.y - mapPinHeight + 'px';
  mapPin.querySelector('img').src = advert.author.avatar;
  mapPin.querySelector('img').alt = advert.offer.title;

  return mapPin;
};

// функция отрисовки созданных меток на карте

var createPin = function (arr) {
  var pin = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    pin.appendChild(renderMapPin(arr[i]));
  }

  return mapPinsList.appendChild(pin);
};

// перевод карты в активный режим и отрисовка меток с объявлениями

map.classList.remove('map--faded');
createPin(adverts);

// функция вывода доступных удобств из объявления

var renderFeatures = function (advert) {
  var features = document.createDocumentFragment();
  for (var i = 0; i < advert.offer.features.length; i++) {
    var feature = document.createElement('li');
    feature.className = 'popup__feature popup__feature--' + advert.offer.features[i];
    features.appendChild(feature);
  }

  return features;
};

// функция вывода доступных фотографий из объявления

var renderPhotos = function (advert) {
  var photos = document.createDocumentFragment();
  for (var i = 0; i < advert.offer.photos.length; i++) {
    var photo = photoTemplate.cloneNode(true);
    photo.src = advert.offer.photos[i];
    photos.appendChild(photo);
  }

  return photos;
};

// функция создания карточки объявления на основе объекта из массива + скрытие блоков с отсутствующими данными

var renderCard = function (advert) {
  var advertCard = cardTemplate.cloneNode(true);
  var advertCardTitle = advertCard.querySelector('.popup__title');
  var advertCardAddress = advertCard.querySelector('.popup__text--address');
  var advertCardPrice = advertCard.querySelector('.popup__text--price');
  var advertCardType = advertCard.querySelector('.popup__type');
  var advertCardCapacity = advertCard.querySelector('.popup__text--capacity');
  var advertCardTime = advertCard.querySelector('.popup__text--time');
  var advertCardFeatures = advertCard.querySelector('.popup__features');
  var advertCardDescription = advertCard.querySelector('.popup__description');
  var advertCardPhotos = advertCard.querySelector('.popup__photos');
  var advertCardAvatar = advertCard.querySelector('.popup__avatar');

  if (advert.offer.title.length === 0) {
    advertCardTitle.classList.add('hidden');
  } else {
    advertCardTitle.textContent = advert.offer.title;
  }

  if (advert.offer.address.length === 0) {
    advertCardAddress.classList.add('hidden');
  } else {
    advertCardAddress.textContent = advert.offer.address;
  }

  if (advert.offer.price === 0) {
    advertCardPrice.classList.add('hidden');
  } else {
    advertCardPrice.textContent = advert.offer.price + ' ₽/ночь';
  }

  if (advert.offer.type.length === 0) {
    advertCardType.classList.add('hidden');
  } else {
    advertCardType.textContent = typesKeys[advert.offer.type];
  }

  if (advert.offer.rooms === 0 && advert.offer.guests === 0) {
    advertCardCapacity.classList.add('hidden');
  } else {
    advertCardCapacity.textContent = ((advert.offer.rooms !== 0) ? advert.offer.rooms + ' комнаты' : '') + ((advert.offer.guests !== 0) ? ' для ' + advert.offer.guests + ' гостей' : '');
  }

  if (advert.offer.checkin.length === 0 && advert.offer.checkout.length === 0) {
    advertCardTime.classList.add('hidden');
  } else {
    advertCardTime.textContent = ((advert.offer.checkin.length !== 0) ? 'Заезд после ' + advert.offer.checkin : '') + ((advert.offer.checkout.length !== 0) ? ' выезд до' + advert.offer.checkout : '');
  }

  if (advert.offer.features.length === 0) {
    advertCardFeatures.classList.add('hidden');
  } else {
    advertCardFeatures.innerHTML = '';
    advertCardFeatures.appendChild(renderFeatures(advert));
  }

  if (advert.offer.description.length === 0) {
    advertCardDescription.classList.add('hidden');
  } else {
    advertCardDescription.textContent = advert.offer.description;
  }

  if (advert.offer.photos.length === 0) {
    advertCardPhotos.classList.add('hidden');
  } else {
    advertCardPhotos.innerHTML = '';
    advertCardPhotos.appendChild(renderPhotos(advert));
  }

  advertCardAvatar.src = advert.author.avatar;

  return advertCard;
};

// функция вставки созданной карточки на карту

var createCard = function (arr) {
  var card = document.createDocumentFragment();
  card.appendChild(renderCard(arr[0]));
  return map.insertBefore(card, mapContainer);
};

// создание карточки объявления

createCard(adverts);
