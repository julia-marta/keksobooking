'use strict';

(function () {
  var featuresSelect = window.main.filter.querySelector('#housing-features');

  var Price = {
    MIN: 10000,
    MAX: 50000
  };

  // функция определения уровня цены

  var getPriceLevel = function (price) {
    var priceLevel;
    if (price < Price.MIN) {
      priceLevel = 'low';
    } else if (price >= Price.MIN && price <= Price.MAX) {
      priceLevel = 'middle';
    } else {
      priceLevel = 'high';
    }
    return priceLevel;
  };

  // функция фильтрации по типу жилья / цене / числу комнат / числу гостей

  var filterBySelectors = function (arr) {
    var filteredBySelectors = window.main.shuffleArray(arr);
    var selectors = window.main.filter.querySelectorAll('select');
    var selectedSelectors = Array.from(selectors).filter(function (it) {
      return it.value !== 'any';
    });

    if (selectedSelectors.length !== 0) {

      var filterBySelectedSelectors = function (filteredArr, filter) {
        switch (filter.name) {
          case 'housing-type':
            return filteredArr.slice().filter(function (it) {
              return it.offer.type === filter.value;
            });
          case 'housing-price':
            return filteredArr.slice().filter(function (it) {
              return getPriceLevel(it.offer.price) === filter.value;
            });
          case 'housing-rooms':
            return filteredArr.slice().filter(function (it) {
              return it.offer.rooms === Number(filter.value);
            });
          case 'housing-guests':
            return filteredArr.slice().filter(function (it) {
              return it.offer.guests === Number(filter.value);
            });
        }
        return filteredArr;
      };

      selectedSelectors.forEach(function (item) {
        filteredBySelectors = filterBySelectedSelectors(filteredBySelectors, item);
      });
    }

    return filteredBySelectors;
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
    var filteredArr = filterByFeatures(filterBySelectors(arr));

    return filteredArr;
  };

  // функция очистки карты и обновления доступных объявлений после изменения значения любого фильтра

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
