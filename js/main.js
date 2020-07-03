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

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var shuffleArray = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  };

  window.main = {
    page: mainPage,
    map: map,
    form: form,
    filter: filter,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    getRandomInt: getRandomInt,
    shuffleArray: shuffleArray
  };
})();
