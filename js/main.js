'use strict';

var ADVERTS_COUNT = 8;
var MAX_PRIXE = 10000;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;
var MIN_COORDINATEY = 130;
var MAX_COORDINATEY = 630;
var MAIN_MOUSE_BUTTON = 0;
var ENTER_KEY = 'Enter';
var ESC_KEY = 'Escape';

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

var guestsInRooms = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};

var map = document.querySelector('.map');
var mapPinsList = map.querySelector('.map__pins');
var mapContainer = document.querySelector('.map__filters-container');

var mapPinMain = map.querySelector('.map__pin--main');
var mapPinMainWidth = mapPinMain.offsetWidth;
var mapPinMainHeight = mapPinMain.offsetHeight;
var mapPinMainX = parseInt(mapPinMain.style.left, 10);
var mapPinMainY = parseInt(mapPinMain.style.top, 10);

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

var form = document.querySelector('.ad-form');
var fieldsets = form.querySelectorAll('fieldset');
var addressField = form.querySelector('#address');
var roomsSelect = form.querySelector('#room_number');
var guestsSelect = form.querySelector('#capacity');
var typeSelect = form.querySelector('#type');
var priceInput = form.querySelector('#price');
var checkinInput = form.querySelector('#timein');
var checkoutInput = form.querySelector('#timeout');

// функция отключения/активации полей формы

var setFieldsState = function () {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = !fieldsets[i].disabled;
  }
};

// функция заполнения поля адреса

var setAddressValue = function () {
  var addressX = Math.floor(mapPinMainX + mapPinMainWidth / 2);
  var addressY = form.classList.contains('ad-form--disabled') ? Math.floor(mapPinMainY + mapPinMainHeight / 2) : Math.floor(mapPinMainY + mapPinMainHeight);

  addressField.value = addressX + ', ' + addressY;
};

// отключение полей формы при неактивном состоянии карты

setFieldsState();

// заполнение поля адреса при неактивном состоянии карты

setAddressValue();

// функция случайного выбора

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция перемешивания массива

var shuffleArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

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
    advertCardType.textContent = typesKeys[advert.offer.type].ru;
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

var mapCard;

var createCard = function (advert) {
  var card = renderCard(advert);
  mapCard = map.insertBefore(card, mapContainer);
  return mapCard;
};

// функция показа и закрытия карточки

var showCard = function (currentPin, advert) {
  var checkedPins = map.querySelectorAll('.map__pin');
  checkedPins.forEach(function (item) {
    if (!item.classList.contains('map__pin--main')) {
      item.classList.remove('map__pin--active');
    }
  });
  currentPin.classList.add('map__pin--active');

  var openedCard = map.querySelector('.map__card');
  if (openedCard) {
    openedCard.remove();
  }
  createCard(advert);

  var cardCloseButton = mapCard.querySelector('.popup__close');

  var onCardEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      evt.preventDefault();
      closeCard(currentPin);
    }
  };

  var closeCard = function () {
    mapCard.remove();
    currentPin.classList.remove('map__pin--active');
    document.removeEventListener('keydown', onCardEscPress);
  };

  cardCloseButton.addEventListener('click', function () {
    closeCard(currentPin);
  });

  document.addEventListener('keydown', onCardEscPress);
};

// функция создания метки + добавление обработчиков клика на этой метке (показ соответствующей карточки)

var renderMapPin = function (advert) {
  var mapPin = mapPinTemplate.cloneNode(true);

  mapPin.style.left = advert.location.x - mapPinWidth / 2 + 'px';
  mapPin.style.top = advert.location.y - mapPinHeight + 'px';
  mapPin.querySelector('img').src = advert.author.avatar;
  mapPin.querySelector('img').alt = advert.offer.title;

  var onMapPinEnterPress = function (evt) {
    if (evt.key === ENTER_KEY) {
      showCard(mapPin, advert);
    }
  };

  mapPin.addEventListener('click', function () {
    showCard(mapPin, advert);
  });
  mapPin.addEventListener('keydown', onMapPinEnterPress);

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

// обработчик клика левой кнопкой мышки на главном пине

var onPinMouseDown = function (evt) {
  if (evt.button === MAIN_MOUSE_BUTTON) {
    activateMap();
  }
};

// обработчик нажатия на Enter на главном пине

var onPinEnterPress = function (evt) {
  if (evt.key === ENTER_KEY) {
    activateMap();
  }
};

// добавление обработчиков на главный пин

mapPinMain.addEventListener('mousedown', onPinMouseDown);
mapPinMain.addEventListener('keydown', onPinEnterPress);

// функция перевода карты в активное состояние + активация полей формы + заполнение поля с адресом + отрисовка меток с объявлениями + удаление обработчиков

var activateMap = function () {
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  setFieldsState();
  setAddressValue();
  createPin(adverts);
  mapPinMain.removeEventListener('mousedown', onPinMouseDown);
  mapPinMain.removeEventListener('keydown', onPinEnterPress);
};

// функция проверки соответствия минимальной цены типу жилья

var checkMinPrice = function (evt) {
  priceInput.min = typesKeys[evt.target.value].min;
  priceInput.placeholder = typesKeys[evt.target.value].min;
};

// добавление обработчика выбора типа жилья

typeSelect.addEventListener('change', checkMinPrice);

// функции синхронизации полей выбора времени заезда и выезда

var checkTimeIn = function () {
  checkoutInput.value = checkinInput.value;
};

var checkTimeOut = function () {
  checkinInput.value = checkoutInput.value;
};

// добавление обработчиков выбора времени заезда и выезда

checkinInput.addEventListener('change', checkTimeIn);
checkoutInput.addEventListener('change', checkTimeOut);

// функция проверки соответствия количества гостей количеству комнат

var checkGuestsNumber = function () {
  if (guestsSelect.options.length > 0) {
    [].forEach.call(guestsSelect.options, function (item) {
      var roomsNumber = roomsSelect.value;
      var guestsNumber = guestsInRooms[roomsNumber];
      var isDisabled = !(guestsNumber.indexOf(item.value) >= 0);

      item.selected = guestsNumber[0] === item.value;
      item.disabled = isDisabled;
      item.hidden = isDisabled;
    });
  }
};

// проверка соответствия количества гостей количеству комнат при активации страницы (до выбора пользователем)

checkGuestsNumber();

// добавление обработчика выбора количества комнат

roomsSelect.addEventListener('change', checkGuestsNumber);
