'use strict';

(function () {
  var Numeral = {
    SINGULAR: 1,
    GENITIVE: [2, 3, 4],
    PLURAL: [11, 12, 13, 14]
  };

  var mapContainer = window.main.map.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var photoTemplate = cardTemplate.querySelector('.popup__photo');

  var renderFeatures = function (advert) {
    var features = document.createDocumentFragment();
    advert.offer.features.forEach(function (item) {
      var feature = document.createElement('li');
      feature.className = 'popup__feature popup__feature--' + item;
      features.appendChild(feature);
    });

    return features;
  };

  var renderPhotos = function (advert) {
    var photos = document.createDocumentFragment();
    advert.offer.photos.forEach(function (item) {
      var photo = photoTemplate.cloneNode(true);
      photo.src = item;
      photos.appendChild(photo);
    });

    return photos;
  };

  var numDecline = function (number, singular, genitive, plural) {
    var modulo = number % 10;
    var form;
    switch (true) {
      case Numeral.PLURAL.indexOf(number) >= 0:
        form = plural;
        break;
      case modulo === Numeral.SINGULAR:
        form = singular;
        break;
      case Numeral.GENITIVE.indexOf(modulo) >= 0:
        form = genitive;
        break;
      default:
        form = plural;
    }

    return number + ' ' + form;
  };

  var renderCard = function (advert) {
    var advertCard = cardTemplate.cloneNode(true);
    var advertCardAvatar = advertCard.querySelector('.popup__avatar');
    var advertCardTitle = advertCard.querySelector('.popup__title');
    var advertCardAddress = advertCard.querySelector('.popup__text--address');
    var advertCardPrice = advertCard.querySelector('.popup__text--price');
    var advertCardType = advertCard.querySelector('.popup__type');
    var advertCardCapacity = advertCard.querySelector('.popup__text--capacity');
    var advertCardTime = advertCard.querySelector('.popup__text--time');
    var advertCardFeatures = advertCard.querySelector('.popup__features');
    var advertCardDescription = advertCard.querySelector('.popup__description');
    var advertCardPhotos = advertCard.querySelector('.popup__photos');

    advertCardAvatar.src = advert.author.avatar;

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
      advertCardTime.textContent = ((advert.offer.checkin.length !== 0) ? 'Заезд после ' + advert.offer.checkin : '') + ((advert.offer.checkout.length !== 0) ? ' выезд до ' + advert.offer.checkout : '');
    }

    if (!advert.offer.features || advert.offer.features.length === 0) {
      advertCardFeatures.classList.add('hidden');
    } else {
      advertCardFeatures.innerHTML = '';
      advertCardFeatures.appendChild(renderFeatures(advert));
    }

    if (!advert.offer.description || advert.offer.description.length === 0) {
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

    return advertCard;
  };

  var createCard = function (advert) {
    var card = renderCard(advert);
    var mapCard = window.main.map.insertBefore(card, mapContainer);
    return mapCard;
  };

  var removeCard = function () {
    var openedCard = window.main.map.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
  };

  window.card = {
    create: createCard,
    remove: removeCard
  };
})();
