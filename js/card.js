'use strict';

(function () {

  var mapContainer = document.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var photoTemplate = cardTemplate.querySelector('.popup__photo');


  // функция вывода доступных удобств из объявления

  var renderFeatures = function (advert) {
    var features = document.createDocumentFragment();
    for (var i = 0; i < advert.offer.features.length; i++) {
      var feature = document.createElement('li');
      feature.className = 'popup__feature popup__feature--' + advert.offer.features[i];
      features.appendChild(feature);
    }
    return features;
  };

  // функция вывода доступных фотографий из объявления

  var renderPhotos = function (advert) {
    var photos = document.createDocumentFragment();
    for (var i = 0; i < advert.offer.photos.length; i++) {
      var photo = photoTemplate.cloneNode(true);
      photo.src = advert.offer.photos[i];
      photos.appendChild(photo);
    }
    return photos;
  };

  // функция подстановки верных склонений существительных после числительных

  var numDecline = function (number, singularform, genitiveform, pluralform) {
    var modulo = number % 10;
    var form;

    if (number >= 11 && number <= 14) {
      form = pluralform;
    } else if (modulo === 1) {
      form = singularform;
    } else if (modulo === 2 || modulo === 3 || modulo === 4) {
      form = genitiveform;
    } else {
      form = pluralform;
    }

    return number + ' ' + form;
  };

  // функция создания карточки объявления на основе объекта из массива + скрытие блоков с отсутствующими данными

  var renderCard = function (advert) {
    var advertCard = cardTemplate.cloneNode(true);
    var advertCardTitle = advertCard.querySelector('.popup__title');
    var advertCardAddress = advertCard.querySelector('.popup__text--address');
    var advertCardPrice = advertCard.querySelector('.popup__text--price');
    var advertCardType = advertCard.querySelector('.popup__type');
    var advertCardCapacity = advertCard.querySelector('.popup__text--capacity');
    var advertCardTime = advertCard.querySelector('.popup__text--time');
    var advertCardFeatures = advertCard.querySelector('.popup__features');
    var advertCardDescription = advertCard.querySelector('.popup__description');
    var advertCardPhotos = advertCard.querySelector('.popup__photos');
    var advertCardAvatar = advertCard.querySelector('.popup__avatar');

    if (advert.offer.title.length === 0) {
      advertCardTitle.classList.add('hidden');
    } else {
      advertCardTitle.textContent = advert.offer.title;
    }

    if (advert.offer.address.length === 0) {
      advertCardAddress.classList.add('hidden');
    } else {
      advertCardAddress.textContent = advert.offer.address;
    }

    if (advert.offer.price === 0) {
      advertCardPrice.classList.add('hidden');
    } else {
      advertCardPrice.textContent = advert.offer.price + ' ₽/ночь';
    }

    if (advert.offer.type.length === 0) {
      advertCardType.classList.add('hidden');
    } else {
      advertCardType.textContent = window.form.typesMap[advert.offer.type].ru;
    }

    if (advert.offer.rooms === 0 && advert.offer.guests === 0) {
      advertCardCapacity.classList.add('hidden');
    } else {
      advertCardCapacity.textContent = ((advert.offer.rooms !== 0) ? numDecline(advert.offer.rooms, 'комната', 'комнаты', 'комнат') : '') + ((advert.offer.guests !== 0) ? ' для ' + numDecline(advert.offer.guests, 'гостя', 'гостей', 'гостей') : '');
    }

    if (advert.offer.checkin.length === 0 && advert.offer.checkout.length === 0) {
      advertCardTime.classList.add('hidden');
    } else {
      advertCardTime.textContent = ((advert.offer.checkin.length !== 0) ? 'Заезд после ' + advert.offer.checkin : '') + ((advert.offer.checkout.length !== 0) ? ' выезд до' + advert.offer.checkout : '');
    }

    if (advert.offer.features.length === 0) {
      advertCardFeatures.classList.add('hidden');
    } else {
      advertCardFeatures.innerHTML = '';
      advertCardFeatures.appendChild(renderFeatures(advert));
    }

    if (advert.offer.description.length === 0) {
      advertCardDescription.classList.add('hidden');
    } else {
      advertCardDescription.textContent = advert.offer.description;
    }

    if (advert.offer.photos.length === 0) {
      advertCardPhotos.classList.add('hidden');
    } else {
      advertCardPhotos.innerHTML = '';
      advertCardPhotos.appendChild(renderPhotos(advert));
    }

    advertCardAvatar.src = advert.author.avatar;

    return advertCard;
  };

  window.card = {
    createCard: function (advert) {
      var card = renderCard(advert);
      var mapCard = window.main.map.insertBefore(card, mapContainer);
      return mapCard;
    }
  };
})();
