'use strict';

(function () {
  var typeSelect = window.main.filter.querySelector('#housing-type');

  // функция фильтрации по типу жилья (позже подумать, как заменить на универсальную для всех фильтров)

  var filterByType = function (arr) {
    var filteredArr = [];
    if (typeSelect.value === 'any') {
      filteredArr = window.main.shuffleArray(arr);
    } else {
      filteredArr = arr.slice().filter(function (it) {
        return it.offer.type === typeSelect.value;
      });
    }
    return filteredArr;
  };

  // добавление обработчика выбора типа жилья

  typeSelect.addEventListener('change', function () {
    window.map.clearMap();
    window.map.filterAds();
  });

  window.filter = {
    filterByType: filterByType
  };
})();
