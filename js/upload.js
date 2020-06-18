'use strict';
(function () {
  window.upload = function (onLoad) {
    var URL = 'https://javascript.pages.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });

    xhr.open('GET', URL);
    xhr.send();
  };
})();
