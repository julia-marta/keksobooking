'use strict';

(function () {

  var MAIN_MOUSE_BUTTON = 0;
  var ENTER_KEY = 'Enter';
  var ESC_KEY = 'Escape';
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');


  window.main = {
    map: map,
    form: form,
    isMainMouseEvent: function (evt, action) {
      if (evt.button === MAIN_MOUSE_BUTTON) {
        action();
      }
    },
    isEnterEvent: function (evt, action, a, b) {
      if (evt.key === ENTER_KEY) {
        action(a, b);
      }
    },
    isEscEvent: function (evt, action) {
      if (evt.key === ESC_KEY) {
        action();
      }
    },
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    shuffleArray: function (arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    }
  };
})();
