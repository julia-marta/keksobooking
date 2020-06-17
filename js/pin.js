'use strict';

(function () {
  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPinsList = window.main.map.querySelector('.map__pins');

  // функция показа и закрытия карточки для каждой метки

  var showCard = function (currentPin, advert) {
    var checkedPins = window.main.map.querySelectorAll('.map__pin');
    checkedPins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        item.classList.remove('map__pin--active');
      }
    });
    currentPin.classList.add('map__pin--active');

    var openedCard = window.main.map.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
    var mapCard = window.card.createCard(advert);
    var cardCloseButton = mapCard.querySelector('.popup__close');

    var onCardEscPress = function (evt) {
      window.main.isEscEvent(evt, closeCard);
    };

    var closeCard = function () {
      mapCard.remove();
      currentPin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', onCardEscPress);
    };

    cardCloseButton.addEventListener('click', function () {
      closeCard();
    });
    document.addEventListener('keydown', onCardEscPress);
  };

  // функция создания метки + добавление обработчиков клика на этой метке (показ соответствующей карточки)

  var renderMapPin = function (advert) {
    var mapPin = mapPinTemplate.cloneNode(true);

    mapPin.style.left = advert.location.x - window.data.mapPinWidth / 2 + 'px';
    mapPin.style.top = advert.location.y - window.data.mapPinHeight + 'px';
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

  window.pin = {
    createPin: function (arr) {
      var pin = document.createDocumentFragment();
      for (var i = 0; i < arr.length; i++) {
        pin.appendChild(renderMapPin(arr[i]));
      }
      return mapPinsList.appendChild(pin);
    }
  };
})();
