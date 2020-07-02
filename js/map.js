'use strict';

(function () {

  var MAIN_MOUSE_BUTTON = 0;
  var MIN_MAP_Y = 130;
  var MAX_MAP_Y = 630;

  var mapPinElement = document.querySelector('.map__pin');
  var mapPinWidth = mapPinElement.offsetWidth;
  var mapPinHeight = mapPinElement.offsetHeight;
  var mapPinMain = window.main.map.querySelector('.map__pin--main');
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var mapPinMainHeight = mapPinMain.offsetHeight;
  var mapPinMainDefaultX = mapPinMain.offsetLeft;
  var mapPinMainDefaultY = mapPinMain.offsetTop;
  var mapPinMainCenterDefaultX = mapPinMainDefaultX + mapPinMainWidth / 2;
  var mapPinMainCenterDefaultY = mapPinMainDefaultY + mapPinMainHeight / 2;
  var fieldsets = window.main.form.querySelectorAll('fieldset');
  var addressField = window.main.form.querySelector('#address');

  var MapBorder = {
    TOP: MIN_MAP_Y - mapPinHeight,
    RIGHT: window.main.map.offsetWidth - mapPinWidth / 2,
    BOTTOM: MAX_MAP_Y - mapPinHeight,
    LEFT: 0 - mapPinWidth / 2
  };

  var ads = [];

  // функция отключения/активации полей фильтра

  var setFilterState = function () {
    [].forEach.call(window.main.filter.elements, function (item) {
      item.disabled = !item.disabled;
    });
  };

  // функция отключения/активации полей формы

  var setFieldsState = function () {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = !fieldsets[i].disabled;
    }
  };

  // функция заполнения поля адреса

  var setAddressValue = function (x, y) {
    var addressX = Math.floor(x);
    var addressY = Math.floor(y);

    addressField.value = addressX + ', ' + addressY;
  };

  // обработчик нажатия левой кнопкой мышки на главном пине

  var onPinMouseDown = function (evt) {
    if (evt.button === MAIN_MOUSE_BUTTON) {
      activateMap();
    }
  };

  // обработчик нажатия на Enter на главном пине

  var onPinEnterPress = function (evt) {
    window.main.isEnterEvent(evt, activateMap);
  };

  // обработчик перемещения главного пина

  var onPinMousePull = function (evt) {
    if (evt.button === MAIN_MOUSE_BUTTON) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var mapPinMainCoords = {
          x: mapPinMain.offsetLeft - shift.x,
          y: mapPinMain.offsetTop - shift.y
        };

        if (mapPinMainCoords.x >= MapBorder.LEFT && mapPinMainCoords.x <= MapBorder.RIGHT && mapPinMainCoords.y >= MapBorder.TOP && mapPinMainCoords.y <= MapBorder.BOTTOM) {
          mapPinMain.style.left = mapPinMainCoords.x + 'px';
          mapPinMain.style.top = mapPinMainCoords.y + 'px';
        }

        var addressCoords = {
          x: mapPinMainCoords.x + (mapPinMainWidth / 2),
          y: mapPinMainCoords.y + mapPinMainHeight
        };

        setAddressValue(addressCoords.x, addressCoords.y);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  // изначальное неактивное состояние карты: отключение полей фильтра и формы, заполнение поля адреса, добавление обработчиков на главный пин

  var setNonActiveMap = function () {
    setFilterState();
    setFieldsState();
    setAddressValue(mapPinMainCenterDefaultX, mapPinMainCenterDefaultY);
    mapPinMain.addEventListener('mousedown', onPinMouseDown);
    mapPinMain.addEventListener('keydown', onPinEnterPress);
    mapPinMain.addEventListener('mousedown', onPinMousePull);
  };

  // установка изначального неактивного состояния карты

  setNonActiveMap();

  // функция фильтрации полученных данных и отрисовки отфильтрованных меток

  var filterAds = function () {
    var filteredAds = window.filter.filterData(ads);
    window.pin.createPins(filteredAds);
  };

  // успешное получение данных: сохранение копии массива, перемешивание, фильтрация и отрисовка, активация полей фильтра

  var onSuccessLoad = function (data) {
    var dataCopy = data.slice();
    ads = window.main.shuffleArray(dataCopy);
    filterAds();
    setFilterState();
  };

  // функция перевода карты в активное состояние: активация полей формы, заполнение поля с адресом, получение данных с сервера, удаление обработчиков

  var activateMap = function () {
    window.main.map.classList.remove('map--faded');
    window.main.form.classList.remove('ad-form--disabled');
    setFieldsState();
    setAddressValue(mapPinMainCenterDefaultX, mapPinMainCenterDefaultY + mapPinMainHeight / 2);
    window.upload.get(onSuccessLoad);

    mapPinMain.removeEventListener('mousedown', onPinMouseDown);
    mapPinMain.removeEventListener('keydown', onPinEnterPress);
  };

  // функция очистки карты: удаление всех меток и закрытие открытой карточки объявления

  var clearMap = function () {
    var pins = window.main.map.querySelectorAll('.map__pin');
    pins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        window.pin.mapPinsList.removeChild(item);
      }
    });

    var openedCard = window.main.map.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
  };

  // функция перевода карты в неактивное состояние: очистка карты, сброс и блокировка формы, сброс фильтра, возврат пина в исходные координаты, изначальные настройки неактивной карты

  var deactivateMap = function () {
    clearMap();
    setNonActiveMap();
    window.main.map.classList.add('map--faded');
    window.main.form.classList.add('ad-form--disabled');
    window.form.resetForm();
    window.main.filter.reset();
    mapPinMain.style.top = mapPinMainDefaultY + 'px';
    mapPinMain.style.left = mapPinMainDefaultX + 'px';
  };

  window.map = {
    mapPinWidth: mapPinWidth,
    mapPinHeight: mapPinHeight,
    clearMap: clearMap,
    deactivateMap: deactivateMap,
    filterAds: filterAds
  };
})();
