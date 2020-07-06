'use strict';

(function () {

  var Key = {
    ENTER: 'Enter',
    ESC: 'Escape'
  };

  var mainPage = document.querySelector('main');
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var filter = map.querySelector('.map__filters');

  var isEnterEvent = function (evt, action, a, b) {
    if (evt.key === Key.ENTER) {
      action(a, b);
    }
  };

  var isEscEvent = function (evt, action) {
    if (evt.key === Key.ESC) {
      action();
    }
  };

  window.main = {
    page: mainPage,
    map: map,
    form: form,
    filter: filter,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };
})();
