'use strict';
(function () {
  var URL_TO_GET = 'https://javascript.pages.academy/keksobooking/data';
  var URL_TO_POST = 'https://javascript.pages.academy/keksobooking';
  var GET = 'GET';
  var POST = 'POST';

  var statusCode = {
    OK: 200
  };

  var onData = function (method, url, data, onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url);
    xhr.send(data);

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
  };

  window.upload = {
    get: function (onLoad) {
      onData(GET, URL_TO_GET, null, onLoad, null);
    },
    send: function (data, onLoad, onError) {
      onData(POST, URL_TO_POST, data, onLoad, onError);
    }
  };
})();
