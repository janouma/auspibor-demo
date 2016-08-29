(function() {
  var Book, BookMedia, IEDetector, ImageLoader, Music, Player, SCALE, ScreenConfig, Video, configure,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SCALE = 1;

  configure = function() {
    Logger.useDefaults();
    return Logger.setLevel(Logger.OFF);
  };

  BookMedia = (function() {
    var allowMusicOn, clazz, soundIconSelector;

    clazz = BookMedia;

    soundIconSelector = '#volume-control .icon';

    allowMusicOn = function(switchOn) {
      return $(soundIconSelector).toggleClass('off', !switchOn).toggleClass('on', switchOn);
    };

    BookMedia.musicSwithIsOff = function() {
      return amplify.store('soundOff');
    };

    BookMedia.musicSwithIsOn = function() {
      return !clazz.musicSwithIsOff();
    };

    BookMedia.musicSwitch = function(switchOn) {
      amplify.store('soundOff', switchOn);
      return allowMusicOn(switchOn);
    };

    BookMedia.musicSwitchOn = function() {
      return clazz.musicSwitch(false);
    };

    BookMedia.musicSwitchOff = function() {
      return clazz.musicSwitch(true);
    };

    BookMedia.musicOff = function() {
      Howler.mute();
      return clazz.musicSwitchOff();
    };

    BookMedia.musicOn = function() {
      Howler.unmute();
      return clazz.musicSwitchOn();
    };

    BookMedia.toggleMusic = function() {
      if (clazz.musicSwithIsOff()) {
        return clazz.musicOn();
      } else {
        return clazz.musicOff();
      }
    };

    BookMedia.pause = function() {
      Player.pause();
      Player.fullscreenOff();
      return Player.reset();
    };

    BookMedia.allowMusicOn = function() {
      return allowMusicOn(true);
    };

    BookMedia.allowMusicOff = function() {
      return allowMusicOn(!true);
    };

    BookMedia.initSound = function() {
      if (clazz.musicSwithIsOn()) {
        return clazz.musicOn();
      } else {
        return clazz.musicOff();
      }
    };

    function BookMedia() {
      throw new Error("The class '" + this.constructor.name + "' cannot be instanciated");
    }

    return BookMedia;

  })();

  IEDetector = (function() {
    var isIE9;

    isIE9 = false;

    IEDetector.detect = function() {
      return isIE9 = $('html').hasClass('ie9');
    };

    function IEDetector() {
      throw new Error("The class '" + this.constructor.name + "' cannot be instanciated");
    }

    IEDetector.ie9 = function() {
      return isIE9;
    };

    return IEDetector;

  })();

  Music = (function() {
    var PLAYING, STOPPED;

    PLAYING = 'playing';

    STOPPED = 'stopped';

    function Music(settings) {
      this.stop = bind(this.stop, this);
      this.start = bind(this.start, this);
      var onload;
      this.howlerOptions = settings.howlerOptions;
      this.volume = this.howlerOptions.volume || 0.3;
      this.playingStatus = STOPPED;
      this.fullVersionSprite = settings.fullVersionSprite;
      this.howlerOptions.onplay = (function(_this) {
        return function() {
          return _this.playingStatus = PLAYING;
        };
      })(this);
      this.howlerOptions.onstop = (function(_this) {
        return function() {
          return _this.playingStatus = STOPPED;
        };
      })(this);
      onload = this.howlerOptions.onload;
      this.howlerOptions.onload = (function(_this) {
        return function() {
          Logger.info("Music is loaded");
          _this.ready = true;
          if (onload) {
            onload();
          }
          if (_this.playingStatus === STOPPED && _this.currentSprite) {
            Logger.debug("Sprite '" + _this.currentSprite + "' should be playing already");
            if (IEDetector.ie9()) {
              return _this.music.play(_this.fullVersionSprite);
            } else {
              return _this.music.play(_this.currentSprite);
            }
          }
        };
      })(this);
      this.ready = false;
      this.music = new Howl(this.howlerOptions);
    }

    Music.prototype.start = function(sprite) {
      if (!sprite) {
        throw new Error("sprite argument cannot be null");
      }
      if (!this.currentSprite) {
        bookMediaControler.musicOn();
        if (this.ready) {
          if (!IEDetector.ie9()) {
            this.music.play(sprite);
          } else {
            this.music.play(this.fullVersionSprite);
          }
        }
        return this.currentSprite = sprite;
      }
    };

    Music.prototype.stop = function() {
      if (this.ready) {
        this.music.stop();
      }
      return this.currentSprite = null;
    };

    Music.prototype.resumeSprite = function(sprite) {
      if (this.ready) {
        if (IEDetector.ie9() && !this.currentSprite) {
          this.music.play(this.fullVersionSprite);
        }
        if (!IEDetector.ie9() && this.currentSprite !== sprite) {
          this.music.stop().play(sprite);
        }
      }
      return this.currentSprite = sprite;
    };

    return Music;

  })();

  Book = (function() {
    function Book(settings1) {
      var appendixCount, self, videoCount;
      this.settings = settings1;
      this.onTurning = bind(this.onTurning, this);
      this.onTurnEnd = bind(this.onTurnEnd, this);
      this.onMusicLoad = bind(this.onMusicLoad, this);
      this.layer = $(this.settings.layer);
      this.frame = $(this.settings.frame);
      this.book = $(this.settings.book);
      this.firstInnerCover = $('.inner-cover:eq(0)', this.book);
      this.lastInnerCover = $('.inner-cover:eq(1)', this.book);
      self = this;
      $('.page-content').addClass('own-size');
      $('.snapshot.controls').each(function() {
        var currentNode, videoId;
        currentNode = $(this);
        videoId = currentNode.attr("data-video-id");
        currentNode.attr('id', "controls-" + videoId).css({
          backgroundImage: "url(" + (currentNode.attr('data-colors')) + ")"
        });
        currentNode.after("<map id=\"map-" + videoId + "\" name=\"map-" + videoId + "\">\n<area data-video-id=\"" + videoId + "\" shape=\"rect\" coords=\"" + (191 * SCALE) + "," + (105 * SCALE) + "," + (248 * SCALE) + "," + (140 * SCALE) + "\" href=\"javascript:void(0)\" class=\"play\" />\n<area data-video-id=\"" + videoId + "\" shape=\"rect\" coords=\"" + (410 * SCALE) + "," + (218 * SCALE) + "," + (428 * SCALE) + "," + (236 * SCALE) + "\" href=\"javascript:void(0)\" class=\"fullscreen magnify\"/>\n</map>");
        return currentNode.attr('usemap', "#map-" + videoId);
      });
      this.book.on('mouseover', '.magnify', function(event) {
        return $(this).qtip({
          overwrite: false,
          content: self.layer.attr('data-magnify-tooltip'),
          position: {
            my: 'bottom center',
            at: 'top right'
          },
          show: {
            event: event.type,
            ready: true
          },
          style: {
            classes: 'qtip-blue qtip-rounded',
            width: 130
          }
        }, event);
      });
      if (!$('html').hasClass('sd')) {
        Video.init({
          playImg: this.layer.attr('data-play-img'),
          pauseImg: this.layer.attr('data-pause-img')
        });
      } else {
        Video.init({
          playImg: this.layer.attr('data-play-img-sd'),
          pauseImg: this.layer.attr('data-pause-img-sd')
        });
      }
      $('.snapshot.controls').attr('src', Video.playImg);
      this.videoPages = [];
      videoCount = 0;
      this.appendixes = [];
      appendixCount = 0;
      this.namedPages = {};
      $(this.settings.book + " > div").each((function(_this) {
        return function(index, element) {
          if ($(element).hasClass('video-page')) {
            _this.videoPages[++videoCount] = index + 1;
          }
          if ($(element).hasClass('appendix-page')) {
            _this.appendixes[++appendixCount] = index + 1;
          }
          if ($(element).attr('id')) {
            return _this.namedPages[$(element).attr('id')] = index + 1;
          }
        };
      })(this));
    }

    Book.prototype.onMusicLoad = function() {
      BookMedia.initSound();
      return $('#volume-control').click(function() {
        return BookMedia.toggleMusic();
      });
    };

    Book.prototype.debug = function() {
      this.layer.append("<div class=\"debug-cross\" id=\"cross1\"></div>\n<div class=\"debug-cross\" id=\"cross2\"></div>\n<div class=\"debug-cross\" id=\"cross3\"></div>");
      $('body').append('<div class="debug-cross" id="cross4"></div>');
      $('.debug-cross').css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '30px',
        height: '30px',
        border: 'white solid',
        borderWidth: '3px 0 0 3px'
      });
      return this.layer.css({
        backgroundColor: 'rgba(100,100,100,0.5)'
      });
    };

    Book.prototype.show = function() {
      if (!this.started) {
        return setTimeout((function(_this) {
          return function() {
            _this.start();
            return _this.startRouter();
          };
        })(this), 1000);
      }
    };

    Book.prototype.start = function() {
      var base, bodyNode;
      if ((base = this.settings).debug == null) {
        base.debug = false;
      }
      bodyNode = $('body');
      this.music = new Music({
        fullVersionSprite: 'fullversion',
        howlerOptions: {
          urls: [bodyNode.attr('data-music-mp3'), bodyNode.attr('data-music-ogg'), bodyNode.attr('data-music-wma')],
          sprite: {
            all: [0, 331283],
            introclusion: [8000, 32000],
            war: [40000, 51250],
            meeting: [93700, 36775],
            justice: [131400, 38800],
            run: [274975, 35050],
            auspibor: [186525, 23875],
            friendship: [210500, 38810],
            homecoming: [310910, 16590],
            legend: [256350, 14850],
            epic: [102500, 68200],
            enchanted: [195250, 136033],
            fullversion: [8000, 323283]
          },
          volume: 0.3,
          loop: true,
          onload: this.onMusicLoad
        }
      });
      this.startTurnJs();
      if (this.settings.debug) {
        this.debug();
      }
      this.bookmark = $('#bookmark');
      this.bookmarkPageWrapper = !IEDetector.ie9() ? $('.flipbook .page-wrapper[page="4"]') : $('.flipbook .page-wrapper[page="2"]');
      this.prefacePage = $('#preface');
      this.frame.on('click', '.play,.fullscreen,a[data-link]', function() {
        var currentNode, page, ref;
        currentNode = $(this);
        if (currentNode.hasClass('play')) {
          Player.togglePlay(currentNode);
          $("#controls-" + (currentNode.attr('data-video-id'))).removeClass('paused');
        }
        if (currentNode.hasClass('fullscreen')) {
          Player.toggleFullscreen();
        }
        if (currentNode.attr('data-link')) {
          page = currentNode.attr('data-link');
          return (ref = window.parent) != null ? ref.postMessage(JSON.stringify({
            type: 'link',
            page: page
          }), window.location.protocol + "//" + window.location.hostname) : void 0;
        }
      }).on('mouseover', '.snapshot.controls,.play,.fullscreen', function() {
        return $("#video-" + ($(this).attr('data-video-id'))).css({
          visibility: 'visible',
          opacity: 1
        });
      }).on('mouseout', '.snapshot.controls.paused', function() {
        return $("#video-" + ($(this).attr('data-video-id'))).css({
          visibility: 'hidden',
          opacity: 0
        });
      });
      this.frame.addClass('zoom-out');
      this.layer.removeClass('loading');
      return this.started = true;
    };

    Book.prototype.onTurnStart = function() {
      return Player.pause();
    };

    Book.prototype.onTurnEnd = function(event, pageObject, turned) {
      var page;
      if (turned) {
        Player.reset();
        page = this.book.turn('page');
        if (!IEDetector.ie9()) {
          this.syncMusic();
        }
        location.hash = "page" + page;
        if (page > this.namedPages.summary && (page < this.book.turn('pages') || IEDetector.ie9())) {
          this.bookmarkPageWrapper.addClass('overflow');
          return this.bookmark.addClass('up');
        } else {
          this.bookmark.removeClass('up');
          return this.bookmarkPageWrapper.removeClass('overflow');
        }
      }
    };

    Book.prototype.onTurning = function(event, currentPage) {
      var bookIsOpen, pages;
      pages = this.book.turn('pages');
      bookIsOpen = currentPage > 1 && currentPage < pages;
      if (!IEDetector.ie9()) {
        this.book.toggleClass('open', bookIsOpen);
        this.firstInnerCover.toggleClass('fixed', currentPage > 1);
        this.lastInnerCover.toggleClass('fixed', currentPage < pages);
      }
      this.prefacePage.toggleClass('fixed', currentPage > this.namedPages.summary);
      if (bookIsOpen) {
        return this.music.start('introclusion');
      } else {
        return this.music.stop();
      }
    };

    Book.prototype.syncMusic = function() {
      var i, page, pages, ref, results;
      pages = this.book.turn('pages');
      page = this.book.turn('page');
      switch (false) {
        case !(indexOf.call([2, 3, 4, 5], page) >= 0 || indexOf.call((function() {
            results = [];
            for (var i = 24, ref = pages - 1; 24 <= ref ? i <= ref : i >= ref; 24 <= ref ? i++ : i--){ results.push(i); }
            return results;
          }).apply(this), page) >= 0):
          return this.music.resumeSprite('introclusion');
        case indexOf.call([6, 7], page) < 0:
          return this.music.resumeSprite('war');
        case indexOf.call([8, 9, 10, 11, 12, 13, 14, 15], page) < 0:
          return this.music.resumeSprite('justice');
        case indexOf.call([16, 17, 18, 19, 20, 21, 22, 23], page) < 0:
          return this.music.resumeSprite('enchanted');
      }
    };

    Book.prototype.startTurnJs = function() {
      return this.book.turn({
        autoCenter: !IEDetector.ie9(),
        when: {
          start: this.onTurnStart,
          end: this.onTurnEnd,
          turning: this.onTurning
        }
      });
    };

    Book.prototype.startRouter = function() {
      var router, self;
      self = this;
      router = Sammy();
      router.get('video:id', function() {
        var id, page;
        id = this.params.id;
        page = self.videoPages[id];
        if (page) {
          return self.seek(page);
        } else {
          return this.notFound();
        }
      });
      router.get('appendix:id', function() {
        var id, page;
        id = this.params.id;
        page = self.appendixes[id];
        if (page) {
          return self.seek(page);
        } else {
          return this.notFound();
        }
      });
      router.get('namedpage:id', function() {
        var id, page;
        id = this.params.id;
        page = self.namedPages[id];
        if (page) {
          return self.seek(page);
        } else {
          return this.notFound();
        }
      });
      router.get('page:page', function() {
        return self.seek(this.params.page);
      });
      router.get('', function() {
        return self.book.turn('page', 1);
      });
      return router.run();
    };

    Book.prototype.seek = function(page) {
      if (page !== this.book.turn('page')) {
        return this.book.turn('page', page);
      }
    };

    return Book;

  })();

  Player = (function() {
    var video;

    video = null;

    function Player() {
      throw new Error("The class '" + this.constructor.name + "' cannot be instanciated");
    }

    Player.togglePlay = function(trigger) {
      if (video) {
        return video.togglePlay();
      } else {
        return video = new Video(trigger);
      }
    };

    Player.toggleFullscreen = function() {
      return video != null ? video.toggleFullscreen() : void 0;
    };

    Player.pause = function() {
      return video != null ? video.pause() : void 0;
    };

    Player.fullscreenOff = function() {
      return video != null ? video.fullscreenOff() : void 0;
    };

    Player.reset = function() {
      var controls;
      if (video) {
        video.remove();
        controls = $("#controls-" + video.id);
        controls.css({
          backgroundImage: "url(" + (controls.attr('data-colors')) + ")"
        }).addClass('paused').attr('src', Video.playImg);
        return video = null;
      }
    };

    return Player;

  })();

  Video = (function() {
    var clazz;

    clazz = Video;

    Video.init = function(settings) {
      clazz.playImg = settings.playImg;
      return clazz.pauseImg = settings.pauseImg;
    };

    function Video(control) {
      this.control = control;
      this.fullscreenOff = bind(this.fullscreenOff, this);
      this.paused = true;
      this.fullscreen = false;
      this.ready = false;
      this.id = this.control.attr('data-video-id');
      $('.snapshot.animation-mark', this.control.parents('.snapshot-frame')).after("<iframe id=\"video-" + this.id + "\" class=\"video\" src=\"http://player.vimeo.com/video/" + this.id + "?api=1&player_id=video-" + this.id + "\" width=\"" + (440 * SCALE) + "\" height=\"" + (247 * SCALE) + "\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
      this.videoIframe = $("#video-" + this.id);
      this.video = $f(this.videoIframe[0]);
      this.video.addEvent('ready', (function(_this) {
        return function() {
          var controls;
          _this.ready = true;
          controls = $("#controls-" + _this.id).css({
            backgroundImage: 'none'
          });
          _this.video.addEvent('play', function() {
            _this.paused = false;
            return controls.attr('src', clazz.pauseImg);
          });
          _this.video.addEvent('pause', function() {
            _this.paused = true;
            return controls.attr('src', clazz.playImg);
          });
          _this.video.addEvent('finish', function() {
            _this.paused = true;
            controls.attr('src', clazz.playImg);
            _this.videoIframe.css({
              visibility: 'hidden',
              opacity: 0
            });
            return controls.addClass('paused');
          });
          return _this.togglePlay();
        };
      })(this));
    }

    Video.prototype.togglePlay = function() {
      if (this.paused) {
        return this.play();
      } else {
        return this.pause();
      }
    };

    Video.prototype.pause = function() {
      var ref;
      if (this.ready) {
        return (ref = this.video) != null ? ref.api('pause') : void 0;
      }
    };

    Video.prototype.play = function() {
      var ref;
      if (this.ready) {
        return (ref = this.video) != null ? ref.api('play') : void 0;
      }
    };

    Video.prototype.toggleFullscreen = function() {
      if (!this.fullscreen) {
        return this.fullscreenOn();
      } else {
        return this.fullscreenOff();
      }
    };

    Video.prototype.fullscreenOn = function() {
      var tempVideo;
      this.pause();
      $('body').append("<iframe id=\"fullscreen-video\" class=\"video fullscreen\" src=\"http://player.vimeo.com/video/" + this.id + "?api=1&player_id=fullscreen-video\" width=\"100%\" height=\"100%\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
      tempVideo = $f($("#fullscreen-video")[0]);
      tempVideo.addEvent('ready', (function(_this) {
        return function() {
          return _this.fullscreenVideo = tempVideo;
        };
      })(this));
      $('#zoom-out').css({
        visibility: 'visible',
        opacity: 1
      }).click(this.fullscreenOff);
      return this.fullscreen = true;
    };

    Video.prototype.fullscreenOff = function() {
      var ref;
      if ((ref = this.fullscreenVideo) != null) {
        ref.api('pause');
      }
      $('#zoom-out').css({
        visibility: 'hidden',
        opacity: 0
      }).off('click');
      $("#fullscreen-video").remove();
      this.fullscreen = false;
      return this.fullscreenVideo = null;
    };

    Video.prototype.remove = function() {
      this.pause();
      return this.videoIframe.remove();
    };

    return Video;

  })();

  ImageLoader = (function() {
    var idSequence;

    idSequence = 0;

    ImageLoader.prototype.loadedImagesCount = 0;

    function ImageLoader(settings1) {
      this.settings = settings1;
      this.afterLoad = this.settings.afterLoad;
      this.afterSingleLoad = this.settings.afterSingleLoad;
      this.images = $(this.settings.imagesSelector || '#image-loader i');
      this.srcAttr = this.settings.srcAttr || 'src';
      if (typeof this.settings.transform === 'function') {
        this.transform = this.settings.transform;
      } else {
        this.transform = function(src) {
          return src;
        };
        if (this.settings.transform != null) {
          Logger.warn("'transform' is not a function");
        }
      }
    }

    ImageLoader.prototype.load = function() {
      var queue, self;
      self = this;
      queue = new createjs.LoadQueue(false);
      queue.addEventListener('complete', (function(_this) {
        return function() {
          var ref;
          return (ref = _this.afterLoad) != null ? ref.call(_this.settings) : void 0;
        };
      })(this));
      queue.addEventListener('fileload', (function(_this) {
        return function(event) {
          var id, image, ref;
          image = event.item;
          id = image.id;
          Logger.debug("Image '" + id + "' has been loaded");
          return (ref = _this.afterSingleLoad) != null ? typeof ref[id] === "function" ? ref[id]() : void 0 : void 0;
        };
      })(this));
      this.images.each(function() {
        var currentNode, imageId;
        currentNode = $(this);
        imageId = currentNode.attr('id') != null ? currentNode.attr('id') : ++idSequence;
        return queue.loadFile({
          id: imageId,
          src: self.transform(currentNode.attr(self.srcAttr))
        }, false);
      });
      return queue.load();
    };

    return ImageLoader;

  })();

  ScreenConfig = (function() {
    ScreenConfig.isWideScreen = function() {
      return getComputedStyle(document.body, ':after').content.trim().replace(/"|'/g, '') === 'widescreen';
    };

    ScreenConfig.isSmallScreen = function() {
      return getComputedStyle(document.body, ':after').content.trim().replace(/"|'/g, '') === 'smallscreen';
    };

    function ScreenConfig() {
      throw new Error("The class '" + this.constructor.name + "' cannot be instanciated");
    }

    return ScreenConfig;

  })();

  $(function() {
    var afterLoad, afterSingleLoad, currentDomain, loadBookPictures, loadDecorations, loadHDImages, loadSnapshots;
    configure();
    currentDomain = location.protocol + "//" + location.hostname;
    if (window.parent === window) {
      location.replace(currentDomain + "#!/brand/legends/book1");
    }
    IEDetector.detect();
    if (ScreenConfig.isSmallScreen()) {
      $('html').addClass('sd');
      SCALE = 0.8;
    }
    window.bookMediaControler = {
      pause: function() {
        return BookMedia.pause();
      },
      musicOn: function() {
        if (BookMedia.musicSwithIsOn()) {
          return Howler.unmute();
        }
      },
      musicOff: function() {
        if (BookMedia.musicSwithIsOn()) {
          return Howler.mute();
        }
      }
    };
    window.book = new Book({
      layer: '#book-layer',
      frame: '#book-frame',
      book: '#legend-book'
    });
    loadHDImages = function() {
      new ImageLoader({
        imagesSelector: 'img[src*="img/ld_"]',
        transform: function(src) {
          return src.replace(/img\/ld_/g, 'img/hd-img/hd_');
        },
        afterLoad: function() {
          var self;
          self = this;
          return $(self.imagesSelector).each(function() {
            var currentNode, lowsrc;
            currentNode = $(this);
            lowsrc = currentNode.attr('src');
            Logger.debug("Swaping to '" + lowsrc + "' HD version");
            return currentNode.attr('src', self.transform(lowsrc));
          });
        }
      }).load();
      return new ImageLoader({
        imagesSelector: '#css-hd-images i',
        srcAttr: 'data-src',
        afterLoad: function() {
          $('#css-hd-images').remove();
          return $('html').addClass('hd');
        }
      }).load();
    };
    loadDecorations = function() {
      var lightCandle;
      lightCandle = function(id, delay) {
        return setTimeout(function() {
          return $("#candle" + id).children('img').css({
            visibility: 'visible'
          }).siblings('.shadow').css({
            opacity: 0.8
          }).siblings('.light').css({
            opacity: 1
          });
        }, delay);
      };
      new ImageLoader({
        imagesSelector: '.candle img',
        afterLoad: function() {
          return $('.candle').each(function(candleIndex) {
            return lightCandle(candleIndex + 1, (candleIndex + 1) * 500 + 1000);
          });
        }
      }).load();
      return new ImageLoader({
        imagesSelector: '#compass',
        afterLoad: function() {
          return $(this.imagesSelector).css({
            visibility: 'visible',
            opacity: 1
          });
        }
      }).load();
    };
    loadBookPictures = function() {
      new ImageLoader({
        imagesSelector: '.snapshot.pyro'
      }).load();
      return new ImageLoader({
        imagesSelector: '.snapshot.controls',
        srcAttr: 'data-colors'
      }).load();
    };
    loadSnapshots = function() {
      return new ImageLoader({
        imagesSelector: '#snapshot-loader i',
        srcAttr: 'data-src',
        afterLoad: function() {
          return $('#snapshot-loader').remove();
        }
      }).load();
    };
    afterLoad = function() {
      var ref;
      $('#image-loader').remove();
      $('body').addClass('bg');
      book.show();
      return (ref = window.parent) != null ? ref.postMessage('bookready', currentDomain) : void 0;
    };
    afterSingleLoad = {
      'fabric-pattern': function() {
        return $('body').addClass('cloth');
      }
    };
    new ImageLoader({
      imagesSelector: '#image-loader i',
      srcAttr: 'data-src',
      afterLoad: afterLoad,
      afterSingleLoad: afterSingleLoad
    }).load();
    return $(window).load(function() {
      loadHDImages();
      loadDecorations();
      loadBookPictures();
      return loadSnapshots();
    });
  });

}).call(this);
