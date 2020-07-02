'use strict';

(function () {
  var filters = Array.from(window.main.filter.children);

  var priceMap = {
    'low': {
      min: 0,
      max: 9999
    },
    'middle': {
      min: 10000,
      max: 49999
    },
    'high': {
      min: 50000,
      max: Infinity
    }
  };

  // объект с функциями для каждого типа фильтра (проверка совпадения соответствующего свойства в объявлении со значением выбранного фильтра)

  var filterRules = {
    'housing-type': function (ad, filter) {
      return ad.offer.type === filter.value;
    },
    'housing-price': function (ad, filter) {
      return ad.offer.price >= priceMap[filter.value].min && ad.offer.price <= priceMap[filter.value].max;
    },
    'housing-rooms': function (ad, filter) {
      return ad.offer.rooms === Number(filter.value);
    },
    'housing-guests': function (ad, filter) {
      return ad.offer.guests === Number(filter.value);
    },
    'housing-features': function (ad, filter) {
      var selectedFeatures = Array.from(filter.querySelectorAll('input:checked'));
      return selectedFeatures.every(function (item) {
        return ad.offer.features.some(function (feature) {
          return feature === item.value;
        });
      });
    }
  };

  // функция фильтрации полученного массива: перебор всех фильтров и сравнение каждого элемента массива со значением этого фильтра с помощью функций из объекта с правилами

  var filterData = function (arr) {
    var filteredArr = arr.filter(function (item) {
      return filters.every(function (filter) {
        return (filter.value === 'any') ? true : filterRules[filter.id](item, filter);
      });
    });

    return filteredArr;
  };

  // функция очистки карты и повторной фильтрации объявлений после изменения значения любого фильтра (с устранением дребезга)

  var onFilterChange = window.debounce(function () {
    window.map.clearMap();
    window.map.filterAds();
  });

  // добавление обработчиков на все фильтры

  window.main.filter.addEventListener('change', onFilterChange);

  window.filter = {
    filterData: filterData
  };
})();
