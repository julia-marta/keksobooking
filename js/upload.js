'use strict';
(function () {
  var URL_TO_GET = 'https://javascript.pages.academy/keksobooking/data';
  var URL_TO_POST = 'https://javascript.pages.academy/keksobooking';
  var GET = 'GET';
  var POST = 'POST';

  var StatusCode = {
    OK: 200
  };

  var onData = function (onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', function () {
      onError();
    });

    if (data) {
      xhr.open(POST, URL_TO_POST);
      xhr.send(data);
    } else {
      xhr.open(GET, URL_TO_GET);
      xhr.send();
    }
  };

  window.upload = {
    get: onData,
    send: onData
  };
})();
