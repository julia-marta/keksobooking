'use strict';

(function () {

  var roomsSelect = window.main.form.querySelector('#room_number');
  var guestsSelect = window.main.form.querySelector('#capacity');
  var typeSelect = window.main.form.querySelector('#type');
  var priceInput = window.main.form.querySelector('#price');
  var checkinInput = window.main.form.querySelector('#timein');
  var checkoutInput = window.main.form.querySelector('#timeout');
  var resetButton = window.main.form.querySelector('.ad-form__reset');

  var successMessageTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var typesMap = {
    palace: {
      ru: 'Дворец',
      min: 10000
    },
    flat: {
      ru: 'Квартира',
      min: 1000
    },
    house: {
      ru: 'Дом',
      min: 5000
    },
    bungalo: {
      ru: 'Бунгало',
      min: 0
    }
  };

  var guestsInRooms = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  var checkMinPrice = function (evt) {
    priceInput.min = typesMap[evt.target.value].min;
    priceInput.placeholder = typesMap[evt.target.value].min;
  };

  typeSelect.addEventListener('change', checkMinPrice);

  var checkTimeIn = function () {
    checkoutInput.value = checkinInput.value;
  };

  var checkTimeOut = function () {
    checkinInput.value = checkoutInput.value;
  };

  checkinInput.addEventListener('change', checkTimeIn);
  checkoutInput.addEventListener('change', checkTimeOut);

  var checkGuestsNumber = function () {
    if (guestsSelect.options.length > 0) {
      [].forEach.call(guestsSelect.options, function (item) {
        var roomsNumber = roomsSelect.value;
        var guestsNumber = guestsInRooms[roomsNumber];
        var isDisabled = !(guestsNumber.indexOf(item.value) >= 0);

        item.selected = guestsNumber[0] === item.value;
        item.disabled = isDisabled;
        item.hidden = isDisabled;
      });
    }
  };

  checkGuestsNumber();
  roomsSelect.addEventListener('change', checkGuestsNumber);

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

  var onSuccessSubmit = function () {
    addMessage(successMessageTemplate);
    window.map.deactivate();
  };

  var onErrorSubmit = function () {
    addMessage(errorMessageTemplate);
  };

  var onSubmitForm = function (evt) {
    window.upload.send(new FormData(window.main.form), onSuccessSubmit, onErrorSubmit);
    evt.preventDefault();
  };

  window.main.form.addEventListener('submit', onSubmitForm);

  var resetForm = function () {
    window.main.form.reset();
    window.photo.resetImages();
    priceInput.min = typesMap[typeSelect.value].min;
    priceInput.placeholder = typesMap[typeSelect.value].min;
  };

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.map.deactivate();
  });

  window.form = {
    typesMap: typesMap,
    clear: resetForm
  };
})();
