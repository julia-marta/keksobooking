'use strict';

(function () {
  var PINS_COUNT = 5;

  var MapPin = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPinsList = window.main.map.querySelector('.map__pins');

  var showCard = function (currentPin, advert) {
    window.card.remove();
    var checkedPins = window.main.map.querySelectorAll('.map__pin');
    checkedPins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        item.classList.remove('map__pin--active');
      }
    });
    currentPin.classList.add('map__pin--active');

    var mapCard = window.card.create(advert);
    var cardCloseButton = mapCard.querySelector('.popup__close');

    var closeCard = function () {
      mapCard.remove();
      currentPin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', onCardEscPress);
    };

    var onCardEscPress = function (evt) {
      window.main.isEscEvent(evt, closeCard);
    };

    cardCloseButton.addEventListener('click', closeCard);
    document.addEventListener('keydown', onCardEscPress);
  };

  var renderMapPin = function (advert) {
    var mapPin = mapPinTemplate.cloneNode(true);

    mapPin.style.left = getRandomInt(window.map.border.LEFT, window.map.border.RIGHT) - MapPin.WIDTH / 2 + 'px';
    mapPin.style.top = getRandomInt(window.map.border.BOTTOM, window.map.border.TOP) - MapPin.HEIGHT + 'px';
    mapPin.querySelector('img').src = advert.author.avatar;
    mapPin.querySelector('img').alt = advert.offer.title;

    var onMapPinEnterPress = function (evt) {
      window.main.isEnterEvent(evt, showCard, mapPin, advert);
    };

    mapPin.addEventListener('click', function () {
      showCard(mapPin, advert);
    });
    mapPin.addEventListener('keydown', onMapPinEnterPress);

    return mapPin;
  };

  var createPins = function (arr) {
    var takeNumber = arr.length > PINS_COUNT ? PINS_COUNT : arr.length;
    for (var i = 0; i < takeNumber; i++) {
      mapPinsList.appendChild(renderMapPin(arr[i]));
    }
  };

  var removePins = function () {
    var pins = window.main.map.querySelectorAll('.map__pin');
    pins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        mapPinsList.removeChild(item);
      }
    });
  };

  window.pin = {
    create: createPins,
    remove: removePins
  };
})();
