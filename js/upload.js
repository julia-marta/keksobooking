'use strict';
(function () {
  var URL_TO_GET = 'https://javascript.pages.academy/keksobooking/data';
  var URL_TO_POST = 'https://javascript.pages.academy/keksobooking';

  var statusCode = {
    OK: 200
  };

  var getData = function (onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });

    xhr.open('GET', URL_TO_GET);
    xhr.send();
  };

  var sendData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === statusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.open('POST', URL_TO_POST);
    xhr.send(data);
  };

  window.upload = {
    get: getData,
    send: sendData
  };
})();
