'use strict';

(function () {

  var mapPinsList = window.main.map.querySelector('.map__pins');
  var mapPinMain = window.main.map.querySelector('.map__pin--main');
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var mapPinMainHeight = mapPinMain.offsetHeight;
  var mapPinMainX = parseInt(mapPinMain.style.left, 10);
  var mapPinMainY = parseInt(mapPinMain.style.top, 10);
  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var fieldsets = window.main.form.querySelectorAll('fieldset');
  var addressField = window.main.form.querySelector('#address');

  // функция отключения/активации полей формы

  var setFieldsState = function () {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = !fieldsets[i].disabled;
    }
  };

  // функция заполнения поля адреса

  var setAddressValue = function () {
    var addressX = Math.floor(mapPinMainX + mapPinMainWidth / 2);
    var addressY = window.main.form.classList.contains('ad-form--disabled') ? Math.floor(mapPinMainY + mapPinMainHeight / 2) : Math.floor(mapPinMainY + mapPinMainHeight);

    addressField.value = addressX + ', ' + addressY;
  };

  // неактивное состояние карты: отключение полей формы и заполнение поля адреса

  setFieldsState();
  setAddressValue();

  // обработчик клика левой кнопкой мышки на главном пине

  var onPinMouseDown = function (evt) {
    window.main.isMainMouseEvent(evt, activateMap);
  };

  // обработчик нажатия на Enter на главном пине

  var onPinEnterPress = function (evt) {
    window.main.isEnterEvent(evt, activateMap);
  };

  // добавление обработчиков на главный пин

  mapPinMain.addEventListener('mousedown', onPinMouseDown);
  mapPinMain.addEventListener('keydown', onPinEnterPress);

  // функция показа и закрытия карточки

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

  // функция отрисовки созданных меток на карте

  var createPin = function (arr) {
    var pin = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      pin.appendChild(renderMapPin(arr[i]));
    }
    return mapPinsList.appendChild(pin);
  };

  // функция перевода карты в активное состояние + активация полей формы + заполнение поля с адресом + отрисовка меток с объявлениями + удаление обработчиков

  var activateMap = function () {
    window.main.map.classList.remove('map--faded');
    window.main.form.classList.remove('ad-form--disabled');
    setFieldsState();
    setAddressValue();
    createPin(window.data.adverts);
    mapPinMain.removeEventListener('mousedown', onPinMouseDown);
    mapPinMain.removeEventListener('keydown', onPinEnterPress);
  };
})();
