'use strict';

(function () {

  var roomsSelect = window.main.form.querySelector('#room_number');
  var guestsSelect = window.main.form.querySelector('#capacity');
  var typeSelect = window.main.form.querySelector('#type');
  var priceInput = window.main.form.querySelector('#price');
  var checkinInput = window.main.form.querySelector('#timein');
  var checkoutInput = window.main.form.querySelector('#timeout');

  var guestsInRooms = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  // функция проверки соответствия минимальной цены типу жилья

  var checkMinPrice = function (evt) {
    priceInput.min = window.data.typesKeys[evt.target.value].min;
    priceInput.placeholder = window.data.typesKeys[evt.target.value].min;
  };

  // добавление обработчика выбора типа жилья

  typeSelect.addEventListener('change', checkMinPrice);

  // функции синхронизации полей выбора времени заезда и выезда

  var checkTimeIn = function () {
    checkoutInput.value = checkinInput.value;
  };

  var checkTimeOut = function () {
    checkinInput.value = checkoutInput.value;
  };

  // добавление обработчиков выбора времени заезда и выезда

  checkinInput.addEventListener('change', checkTimeIn);
  checkoutInput.addEventListener('change', checkTimeOut);

  // функция проверки соответствия количества гостей количеству комнат

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

  // проверка соответствия количества гостей количеству комнат при активации страницы (до выбора пользователем)

  checkGuestsNumber();

  // добавление обработчика выбора количества комнат

  roomsSelect.addEventListener('change', checkGuestsNumber);
})();
