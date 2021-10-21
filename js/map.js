'use strict';

(function () {
  var MAIN_MOUSE_BUTTON = 0;

  var MapBorder = {
    TOP: 130,
    RIGHT: window.main.map.offsetWidth,
    BOTTOM: 630,
    LEFT: 0
  };

  var mapPinMain = window.main.map.querySelector('.map__pin--main');

  var MainPin = {
    WIDTH: mapPinMain.offsetWidth,
    HEIGHT: mapPinMain.offsetHeight,
    TAIL: 15
  };

  var MainPinDefaultCoord = {
    X: mapPinMain.offsetLeft,
    Y: mapPinMain.offsetTop
  };

  var MainPinCenterDefaultCoord = {
    X: MainPinDefaultCoord.X + (MainPin.WIDTH / 2),
    Y: MainPinDefaultCoord.Y + (MainPin.HEIGHT / 2)
  };

  var MainPinMoveLimit = {
    TOP: MapBorder.TOP - (MainPin.HEIGHT + MainPin.TAIL),
    RIGHT: MapBorder.RIGHT - (MainPin.WIDTH / 2),
    BOTTOM: MapBorder.BOTTOM - (MainPin.HEIGHT + MainPin.TAIL),
    LEFT: MapBorder.LEFT - (MainPin.WIDTH / 2)
  };

  var addressField = window.main.form.querySelector('#address');
  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var adverts = [];

  var setFieldsState = function (form) {
    [].forEach.call(form.elements, function (item) {
      item.disabled = !item.disabled;
    });
  };

  var setAddressValue = function (x, y) {
    var addressX = Math.floor(x);
    var addressY = Math.floor(y);

    addressField.value = addressX + ', ' + addressY;
  };

  var onPinMouseDown = function (evt) {
    if (evt.button === MAIN_MOUSE_BUTTON) {
      activateMap();
    }
  };

  var onPinEnterPress = function (evt) {
    window.main.isEnterEvent(evt, activateMap);
  };

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

        if (mapPinMainCoords.x >= MainPinMoveLimit.LEFT && mapPinMainCoords.x <= MainPinMoveLimit.RIGHT && mapPinMainCoords.y >= MainPinMoveLimit.TOP && mapPinMainCoords.y <= MainPinMoveLimit.BOTTOM) {
          mapPinMain.style.left = mapPinMainCoords.x + 'px';
          mapPinMain.style.top = mapPinMainCoords.y + 'px';
        }

        var addressCoords = {
          x: mapPinMainCoords.x + (MainPin.WIDTH / 2),
          y: mapPinMainCoords.y + (MainPin.HEIGHT + MainPin.TAIL)
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

  var setNonActiveMap = function () {
    setFieldsState(window.main.form);
    setFieldsState(window.main.filter);
    setAddressValue(MainPinCenterDefaultCoord.X, MainPinCenterDefaultCoord.Y);
    mapPinMain.addEventListener('mousedown', onPinMouseDown);
    mapPinMain.addEventListener('keydown', onPinEnterPress);
    mapPinMain.addEventListener('mousedown', onPinMousePull);
  };

  setNonActiveMap();

  var addMessage = function (template) {
    var message = template.cloneNode(true);
    window.main.page.appendChild(message);

    var removeMessage = function () {
      window.main.page.removeChild(message);

      document.removeEventListener('keydown', onMessageEscPress);
      document.removeEventListener('click', removeMessage);
    };

    var onMessageEscPress = function (evt) {
      window.main.isEscEvent(evt, removeMessage);
    };

    document.addEventListener('keydown', onMessageEscPress);
    document.addEventListener('click', removeMessage);

    var messageCloseButton = message.querySelector('.error__button');

    if (messageCloseButton) {
      messageCloseButton.addEventListener('click', removeMessage);
    }
  };

  var filterAdverts = function () {
    var filteredAdverts = window.filter.decant(adverts);
    window.pin.create(filteredAdverts);
  };

  var onSuccessLoad = function (data) {
    adverts = data.slice().filter(function (item) {
      return Object.keys(item.offer).length !== 0;
    });
    filterAdverts();
    setFieldsState(window.main.filter);
  };

  var onError = function () {
    addMessage(errorMessageTemplate);
  };

  var activateMap = function () {
    window.main.map.classList.remove('map--faded');
    window.main.form.classList.remove('ad-form--disabled');
    setFieldsState(window.main.form);
    setAddressValue(MainPinCenterDefaultCoord.X, MainPinDefaultCoord.Y + MainPin.HEIGHT + MainPin.TAIL);
    window.upload.get(onSuccessLoad, onError);
    mapPinMain.removeEventListener('mousedown', onPinMouseDown);
    mapPinMain.removeEventListener('keydown', onPinEnterPress);
  };

  var clearMap = function () {
    window.card.remove();
    window.pin.remove();
  };

  var deactivateMap = function () {
    clearMap();
    setNonActiveMap();
    window.main.map.classList.add('map--faded');
    window.main.form.classList.add('ad-form--disabled');
    window.form.clear();
    window.main.filter.reset();
    mapPinMain.style.top = MainPinCenterDefaultCoord.Y + 'px';
    mapPinMain.style.left = MainPinCenterDefaultCoord.X + 'px';
  };

  window.map = {
    clear: clearMap,
    deactivate: deactivateMap,
    filterAdverts: filterAdverts,
    addMessage: addMessage,
    onError: onError,
    border: MapBorder
  };
})();
