(function() {
  var amazonLink, loadHDImages, navigatorLang;

  navigatorLang = function() {
    var searchResults;
    searchResults = /(\w\w).*/gi.exec(window.navigator.language);
    if (searchResults.length > 1) {
      return searchResults[1];
    } else {
      return auspiborDefaultLanguage;
    }
  };

  loadHDImages = function() {
    var hublot, image, images, imagesFolder, loadedImagesCount, logo, src, _i, _len, _results;
    loadedImagesCount = 0;
    imagesFolder = 'assets/img';
    logo = "isologo_lueur.png";
    hublot = "hublot.png";
    images = ["tissu50p.png", "nuages2_parse.png", "nuages1ptransp.png", "bg-earth.png", "dimmed-auspibor-background-grid.png", "amazon-icon-outline.png", "hublot-mer.png", "amazon-icon.png", logo, hublot];
    _results = [];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      src = images[_i];
      image = new Image();
      image.onload = function() {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          document.body.classList.add('hd');
          document.getElementById('logo-img').src = "" + imagesFolder + "/" + logo;
          return document.getElementById('hublot').src = "" + imagesFolder + "/" + hublot;
        }
      };
      _results.push(image.src = "" + imagesFolder + "/" + src);
    }
    return _results;
  };

  amazonLink = document.getElementById("amazon-link");

  amazonLink.setAttribute("href", amazonI18nUrls[navigatorLang()] || amazonI18nUrls[auspiborDefaultLanguage]);

  window.onload = function() {
    document.getElementById('root').style.opacity = 1;
    return loadHDImages();
  };

}).call(this);
