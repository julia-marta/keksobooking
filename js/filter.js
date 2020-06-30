'use strict';

(function () {
  var typeSelect = window.main.filter.querySelector('#housing-type');
  var priceSelect = window.main.filter.querySelector('#housing-price');
  var roomsSelect = window.main.filter.querySelector('#housing-rooms');
  var guestsSelect = window.main.filter.querySelector('#housing-guests');
  var featuresSelect = window.main.filter.querySelector('#housing-features');

  // функция определения уровня цены

  var getPriceLevel = function (price) {
    var priceLevel;
    if (price < 10000) {
      priceLevel = 'low';
    } else if (price >= 10000 && price <= 50000) {
      priceLevel = 'middle';
    } else {
      priceLevel = 'high';
    }
    return priceLevel;
  };

  // функция фильтрации по типу жилья

  var filterByType = function (arr) {
    var filteredByType = window.main.shuffleArray(arr);
    if (typeSelect.value !== 'any') {
      filteredByType = arr.slice().filter(function (it) {
        return it.offer.type === typeSelect.value;
      });
    }
    return filteredByType;
  };

  // функция фильтрации по цене

  var filterByPrice = function (arr) {
    var filteredByPrice = window.main.shuffleArray(arr);
    if (priceSelect.value !== 'any') {
      filteredByPrice = arr.slice().filter(function (it) {
        return getPriceLevel(it.offer.price) === priceSelect.value;
      });
    }
    return filteredByPrice;
  };

  // функция фильтрации по числу комнат

  var filterByRooms = function (arr) {
    var filteredByRooms = window.main.shuffleArray(arr);
    if (roomsSelect.value !== 'any') {
      filteredByRooms = arr.slice().filter(function (it) {
        return it.offer.rooms === Number(roomsSelect.value);
      });
    }
    return filteredByRooms;
  };

  // функция фильтрации по числу гостей

  var filterByGuests = function (arr) {
    var filteredByGuests = window.main.shuffleArray(arr);
    if (guestsSelect.value !== 'any') {
      filteredByGuests = arr.slice().filter(function (it) {
        return it.offer.guests === Number(guestsSelect.value);
      });
    }
    return filteredByGuests;
  };

  // функция фильтрации по наличию удобств

  var filterByFeatures = function (arr) {
    var filteredByFeatures = window.main.shuffleArray(arr);
    var selectedFeatures = featuresSelect.querySelectorAll('input:checked');

    if (selectedFeatures.length !== 0) {
      var filterBySelectedFeatures = function (filteredArr, selectedFeature) {
        return filteredArr.slice().filter(function (it) {
          return it.offer.features.indexOf(selectedFeature) >= 0;
        });
      };

      [].forEach.call(selectedFeatures, function (item) {
        filteredByFeatures = filterBySelectedFeatures(filteredByFeatures, item.value);
      });
    }

    return filteredByFeatures;
  };

  // функция фильтрации данных всеми фильтрами

  var filterData = function (arr) {
    var filteredByType = filterByType(arr);
    var filteredByPrice = filterByPrice(filteredByType);
    var filteredByRooms = filterByRooms(filteredByPrice);
    var filteredByGuests = filterByGuests(filteredByRooms);
    var filteredArr = filterByFeatures(filteredByGuests);

    return filteredArr;
  };

  // функция очистки карты и обновления доступных объявлений после изменения значения любого фильтра

  var onFilterChange = window.debounce(function () {
    window.map.clearMap();
    window.map.filterAds();
  });

  // добавление обработчиков на все фильтры

  typeSelect.addEventListener('change', onFilterChange);
  priceSelect.addEventListener('change', onFilterChange);
  roomsSelect.addEventListener('change', onFilterChange);
  guestsSelect.addEventListener('change', onFilterChange);
  featuresSelect.addEventListener('change', onFilterChange);

  window.filter = {
    filterData: filterData
  };
})();
