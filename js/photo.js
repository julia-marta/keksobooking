'use strict';

(function () {
  var IMAGE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarInput = window.main.form.querySelector('.ad-form__field input[type=file]');
  var avatar = window.main.form.querySelector('.ad-form-header__preview img');
  var photoInput = window.main.form.querySelector('.ad-form__upload input[type=file]');
  var photosContainer = window.main.form.querySelector('.ad-form__photo');

  var createPhoto = function() {
    var photo = document.createElement('img');
    photo.width = photosContainer.offsetWidth;
    photo.height = photosContainer.offsetHeight;
    photosContainer.appendChild(photo);
    return photo;
  }

  var onImageLoad = function (evt) {
    var file = evt.target.files[0];
    var fileType = file.type.toLowerCase();

    var isValidType = IMAGE_TYPES.some(function (it) {
      return fileType.endsWith(it);
    });

    if (isValidType) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        switch (evt.target) {
          case avatarInput:
            avatar.src = reader.result;
            break;
          case photoInput:
            var photo = createPhoto();
            photo.src = reader.result;
            break;
        }
      });
      reader.readAsDataURL(file);
    }
  };

  avatarInput.addEventListener('change', onImageLoad);
  photoInput.addEventListener('change', onImageLoad);
})();
