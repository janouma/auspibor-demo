SCALE = 1

#=========================================================================================
configure =->
  Logger.useDefaults()
  Logger.setLevel Logger.OFF

#=========================================================================================
class BookMedia
  clazz = @
  soundIconSelector = '#volume-control .icon'

  allowMusicOn = (switchOn)->
    $(soundIconSelector)
      .toggleClass('off', not switchOn)
      .toggleClass('on', switchOn)

  @musicSwithIsOff: -> amplify.store('soundOff')

  @musicSwithIsOn: -> not clazz.musicSwithIsOff()

  @musicSwitch: (switchOn)->
    amplify.store 'soundOff', switchOn
    allowMusicOn switchOn

  @musicSwitchOn: -> clazz.musicSwitch false

  @musicSwitchOff: -> clazz.musicSwitch true

  @musicOff: ->
    Howler.mute()
    clazz.musicSwitchOff()

  @musicOn: ->
    Howler.unmute()
    clazz.musicSwitchOn()

  @toggleMusic: -> if clazz.musicSwithIsOff() then clazz.musicOn() else clazz.musicOff()

  @pause: ->
    Player.pause()
    Player.fullscreenOff()
    Player.reset()

  @allowMusicOn: -> allowMusicOn true

  @allowMusicOff: -> allowMusicOn not true

  @initSound: ->
    if clazz.musicSwithIsOn()
      clazz.musicOn()
    else
      clazz.musicOff()

  constructor: ->
    throw new Error "The class '#{@.constructor.name}' cannot be instanciated"


#=========================================================================================
class IEDetector
  isIE9 = false

  @detect: ->
    isIE9 = $('html').hasClass('ie9')

  constructor: ->
    throw new Error "The class '#{@.constructor.name}' cannot be instanciated"

  @ie9: ->
    isIE9


#=========================================================================================
class Music
  PLAYING = 'playing'
  STOPPED = 'stopped'

  constructor: (settings)->
    @howlerOptions = settings.howlerOptions
    @volume = @howlerOptions.volume or 0.3
    @playingStatus = STOPPED
    @fullVersionSprite = settings.fullVersionSprite
    @howlerOptions.onplay = => @playingStatus = PLAYING
    @howlerOptions.onstop = => @playingStatus = STOPPED

    onload = @howlerOptions.onload
    @howlerOptions.onload = =>
      Logger.info "Music is loaded"
      @ready = true
      onload() if onload

      if @playingStatus is STOPPED and @currentSprite
        Logger.debug "Sprite '#{@currentSprite}' should be playing already"
        if IEDetector.ie9()
          @music.play @fullVersionSprite
        else
          @music.play @currentSprite

    @ready = false
    @music = new Howl @howlerOptions


  start: (sprite)=>
    throw new Error "sprite argument cannot be null" if not sprite
    if not @currentSprite

      bookMediaControler.musicOn()

      if @ready

        if not IEDetector.ie9()
          @music.play sprite
        else
          @music.play @fullVersionSprite

      @currentSprite = sprite


  stop: =>
    @music.stop() if @ready
    @currentSprite = null


  resumeSprite: (sprite)->
    if @ready

      if IEDetector.ie9() and not @currentSprite
        @music.play @fullVersionSprite

      if not IEDetector.ie9() and @currentSprite isnt sprite
        @music.stop().play sprite

    @currentSprite = sprite


#=========================================================================================
class Book

  constructor: (@settings)->
    @layer = $ @settings.layer
    @frame = $ @settings.frame
    @book = $ @settings.book
    @firstInnerCover = $('.inner-cover:eq(0)', @book)
    @lastInnerCover = $('.inner-cover:eq(1)', @book)
    self = @

    $('.page-content').addClass 'own-size'
    $('.snapshot.controls').each ->
      currentNode = $(@)
      videoId = currentNode.attr("data-video-id")

      currentNode.attr('id', "controls-#{videoId}")
        .css(backgroundImage: "url(#{currentNode.attr('data-colors')})")

      currentNode.after """
      <map id="map-#{videoId}" name="map-#{videoId}">
      <area data-video-id="#{videoId}" shape="rect" coords="#{191*SCALE},#{105*SCALE},#{248*SCALE},#{140*SCALE}" href="javascript:void(0)" class="play" />
      <area data-video-id="#{videoId}" shape="rect" coords="#{410*SCALE},#{218*SCALE},#{428*SCALE},#{236*SCALE}" href="javascript:void(0)" class="fullscreen magnify"/>
      </map>
      """

      currentNode.attr 'usemap', "#map-#{videoId}"


    @book.on(
      'mouseover'
      '.magnify'
      (event)->
        $(@).qtip(
          overwrite: off
          content: self.layer.attr('data-magnify-tooltip')
          position:
            my: 'bottom center'
            at: 'top right'
          show:
            event: event.type
            ready: on
          style:
            classes: 'qtip-blue qtip-rounded'
            width: 130
          event
        )
    )

    if not $('html').hasClass('sd')
      Video.init(
        playImg: @layer.attr('data-play-img')
        pauseImg: @layer.attr('data-pause-img')
      )
    else
      Video.init(
        playImg: @layer.attr('data-play-img-sd')
        pauseImg: @layer.attr('data-pause-img-sd')
      )

    $('.snapshot.controls').attr 'src', Video.playImg

    @videoPages = []
    videoCount = 0

    @appendixes = []
    appendixCount = 0

    @namedPages = {}

    $("#{@settings.book} > div").each (index, element)=>
      if $(element).hasClass 'video-page'
        @videoPages[++videoCount] = index + 1

      if $(element).hasClass 'appendix-page'
        @appendixes[++appendixCount] = index + 1

      if $(element).attr('id')
        @namedPages[$(element).attr('id')] = index + 1


  onMusicLoad: =>
    BookMedia.initSound()
    $('#volume-control').click -> BookMedia.toggleMusic()


  debug: ->
    @layer.append """
    <div class="debug-cross" id="cross1"></div>
    <div class="debug-cross" id="cross2"></div>
    <div class="debug-cross" id="cross3"></div>
    """
    $('body').append '<div class="debug-cross" id="cross4"></div>'

    $('.debug-cross').css(
      position: 'absolute'
      top: 0
      left: 0
      width: '30px'
      height: '30px'
      border: 'white solid'
      borderWidth: '3px 0 0 3px'
    )

    @layer.css backgroundColor: 'rgba(100,100,100,0.5)'

  show: ->
    if not @started
      setTimeout(
        =>
          @start()
          @startRouter()
        1000
      )

  start: ->
    @settings.debug ?= false

    bodyNode = $('body')

    @music = new Music(
      fullVersionSprite: 'fullversion'
      howlerOptions:
        urls: [
          bodyNode.attr 'data-music-mp3'
          bodyNode.attr 'data-music-ogg'
          bodyNode.attr 'data-music-wma'
        ]

        sprite:
          all: [0, 331283] # for ie9
          introclusion: [8000, 32000] # (1) (5)
          war: [40000, 51250] # (2)
          meeting: [93700, 36775]
          justice: [131400, 38800] # (3)
          run: [274975, 35050]
          auspibor: [186525, 23875]
          friendship: [210500, 38810]
          homecoming: [310910, 16590]
          legend: [256350, 14850]
          epic: [102500, 68200] # ???
          enchanted: [195250, 136033] # (4)
          fullversion: [8000, 323283]

        volume: 0.3
        loop: true
        onload: @onMusicLoad
    )

    @startTurnJs()
    @debug() if @settings.debug

    @bookmark = $('#bookmark')
    @bookmarkPageWrapper = if not IEDetector.ie9() then $('.flipbook .page-wrapper[page="4"]') else $('.flipbook .page-wrapper[page="2"]')
    @prefacePage = $('#preface')

    @frame.on(
      'click'
      '.play,.fullscreen,a[data-link]'
      ->
        currentNode = $(@)

        if currentNode.hasClass 'play'
          Player.togglePlay currentNode
          $("#controls-#{currentNode.attr('data-video-id')}").removeClass 'paused'

        if currentNode.hasClass 'fullscreen'
          Player.toggleFullscreen()

        if currentNode.attr('data-link')
          page = currentNode.attr('data-link')
          window.parent?.postMessage(
            JSON.stringify(
              type: 'link'
              page: page
            )
            "#{window.location.protocol}//#{window.location.hostname}"
          )
    ).on(
      'mouseover'
      '.snapshot.controls,.play,.fullscreen'
      ->
        $("#video-#{$(@).attr('data-video-id')}").css(
          visibility: 'visible'
          opacity: 1
        )
    ).on(
      'mouseout'
      '.snapshot.controls.paused'
      ->
        $("#video-#{$(@).attr('data-video-id')}").css(
          visibility: 'hidden'
          opacity: 0
        )
    )

    @frame.addClass 'zoom-out'
    @layer.removeClass 'loading'
    @started = true


  onTurnStart: -> Player.pause()

  onTurnEnd: (event, pageObject, turned)=>
    if turned
      Player.reset()

      page = @book.turn('page')
      @syncMusic() if not IEDetector.ie9()
      location.hash = "page#{page}"

      if page > @namedPages.summary and (page < @book.turn('pages') or IEDetector.ie9())
        @bookmarkPageWrapper.addClass 'overflow'
        @bookmark.addClass 'up'
      else
        @bookmark.removeClass 'up'
        @bookmarkPageWrapper.removeClass 'overflow'


  onTurning: (event, currentPage)=>
    pages = @book.turn 'pages'
    bookIsOpen = currentPage > 1 and currentPage < pages

    if not IEDetector.ie9()
      @book.toggleClass 'open', bookIsOpen

      @firstInnerCover.toggleClass(
        'fixed'
        currentPage > 1
      )

      @lastInnerCover.toggleClass(
        'fixed'
        currentPage < pages
      )

    @prefacePage.toggleClass(
      'fixed'
      currentPage > @namedPages.summary
    )

    if bookIsOpen
      @music.start('introclusion')
    else
      @music.stop()


  syncMusic: ->
    pages = @book.turn('pages')
    page = @book.turn('page')
    switch
      when page in [2..5] or page in [24..(pages-1)] then @music.resumeSprite 'introclusion'
      when page in [6..7] then @music.resumeSprite 'war'
      when page in [8..15] then @music.resumeSprite 'justice'
      when page in [16..23] then @music.resumeSprite 'enchanted'


  startTurnJs: ->
    @book.turn(
      autoCenter: not IEDetector.ie9()
      when:
        start: @onTurnStart
        end: @onTurnEnd
        turning: @onTurning
    )


  startRouter: ->
    self = @
    router = Sammy()

    router.get(
      'video:id'
      ->
        id = @params.id
        page = self.videoPages[id]
        if page
          self.seek page
        else
          @notFound()
    )

    router.get(
      'appendix:id'
      ->
        id = @params.id
        page = self.appendixes[id]
        if page
          self.seek page
        else
          @notFound()
    )

    router.get(
      'namedpage:id'
      ->
        id = @params.id
        page = self.namedPages[id]
        if page
          self.seek page
        else
          @notFound()
    )

    router.get 'page:page', ->
      self.seek @params.page

    router.get '', ->
      self.book.turn('page', 1)
    router.run()

  seek: (page)->
    @book.turn('page', page) if page isnt @book.turn('page')


#=========================================================================================
class Player
  video = null

  constructor: ->
    throw new Error "The class '#{@.constructor.name}' cannot be instanciated"

  @togglePlay: (trigger)->
    if video
      video.togglePlay()
    else
      video = new Video(trigger)

  @toggleFullscreen: ->
    video?.toggleFullscreen()

  @pause: ->
    video?.pause()

  @fullscreenOff: ->
    video?.fullscreenOff()

  @reset: ->
    if video
      video.remove()
      controls = $("#controls-#{video.id}")
      controls.css(backgroundImage: "url(#{controls.attr('data-colors')})")
        .addClass('paused')
        .attr('src', Video.playImg)
      video = null


#=========================================================================================
class Video
  clazz = @

  @init: (settings)->
    clazz.playImg = settings.playImg
    clazz.pauseImg = settings.pauseImg

  constructor: (@control)->
    @paused = true
    @fullscreen = false
    @ready = false
    @id = @control.attr 'data-video-id'

    $('.snapshot.animation-mark', @control.parents('.snapshot-frame')).after """
     <iframe id="video-#{@id}" class="video" src="http://player.vimeo.com/video/#{@id}?api=1&player_id=video-#{@id}" width="#{440*SCALE}" height="#{247*SCALE}" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
     """
    @videoIframe = $("#video-#{@id}")
    @video = $f(@videoIframe[0])

    @video.addEvent(
      'ready'
      =>
        @ready = true
        controls = $("#controls-#{@id}").css backgroundImage: 'none'

        @video.addEvent 'play', =>
          @paused = false
          controls.attr('src', clazz.pauseImg)

        @video.addEvent 'pause', =>
          @paused = true
          controls.attr('src', clazz.playImg)

        @video.addEvent 'finish', =>
          @paused = true
          controls.attr('src', clazz.playImg)
          @videoIframe.css(
            visibility: 'hidden'
            opacity: 0
          )
          controls.addClass 'paused'

        @togglePlay()
    )


  togglePlay: -> if @paused then @play() else @pause()

  pause: ->
    @video?.api('pause') if @ready
  play: ->
    @video?.api('play') if @ready

  toggleFullscreen: -> if not @fullscreen then @fullscreenOn() else @fullscreenOff()

  fullscreenOn: ->
    @pause()
    $('body').append """
                     <iframe id="fullscreen-video" class="video fullscreen" src="http://player.vimeo.com/video/#{@id}?api=1&player_id=fullscreen-video" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
                     """
    tempVideo = $f($("#fullscreen-video")[0])
    tempVideo.addEvent(
      'ready'
      =>
        @fullscreenVideo = tempVideo
    )

    $('#zoom-out').css(
      visibility: 'visible'
      opacity: 1
    ).click @fullscreenOff

    @fullscreen = true


  fullscreenOff: =>
    @fullscreenVideo?.api 'pause'

    $('#zoom-out').css(
      visibility: 'hidden'
      opacity: 0
    ).off('click')

    $("#fullscreen-video").remove()
    @fullscreen = false
    @fullscreenVideo = null

  remove: ->
    @pause()
    @videoIframe.remove()


#=========================================================================================
class ImageLoader
  idSequence = 0
  loadedImagesCount: 0

  constructor: (@settings)->
    @afterLoad = @settings.afterLoad
    @afterSingleLoad = @settings.afterSingleLoad
    @images = $(@settings.imagesSelector or '#image-loader i')
    @srcAttr = @settings.srcAttr or 'src'

    if typeof @settings.transform is 'function'
      @transform = @settings.transform
    else
      @transform = (src)-> src
      Logger.warn "'transform' is not a function" if @settings.transform?

  load: ->
    self = @
    queue = new createjs.LoadQueue(false)

    queue.addEventListener(
      'complete'
      => @afterLoad?.call @settings
    )

    queue.addEventListener(
      'fileload'
      (event)=>
        image = event.item
        id = image.id
        Logger.debug "Image '#{id}' has been loaded"
        @afterSingleLoad?[id]?()
    )

    @images.each ->
      currentNode = $(@)
      imageId = if currentNode.attr('id')? then currentNode.attr('id') else ++idSequence
      queue.loadFile(
        id: imageId
        src: self.transform currentNode.attr(self.srcAttr)
        false
      )

    queue.load()


#=========================================================================================
class ScreenConfig
  @isWideScreen: -> getComputedStyle(document.body,':after').content.trim().replace(/"|'/g, '') is 'widescreen'
  @isSmallScreen: -> getComputedStyle(document.body,':after').content.trim().replace(/"|'/g, '') is 'smallscreen'
  constructor: -> throw new Error "The class '#{@.constructor.name}' cannot be instanciated"


# Page ready
#=========================================================================================

$ ->
  configure()
  currentDomain = "#{location.protocol}//#{location.hostname}"
  location.replace("#{currentDomain}#!/brand/legends/book1") if window.parent is window

  IEDetector.detect()

  if ScreenConfig.isSmallScreen()
    $('html').addClass 'sd'
    SCALE = 0.8

  window.bookMediaControler = {
    pause: -> BookMedia.pause()
    musicOn: -> Howler.unmute() if BookMedia.musicSwithIsOn()
    musicOff: -> Howler.mute() if BookMedia.musicSwithIsOn()
  }

  window.book = new Book(
    layer: '#book-layer'
    frame: '#book-frame'
    book: '#legend-book'
  )

  # Loading HD images

  loadHDImages = ->
    new ImageLoader(
      imagesSelector: 'img[src*="img/ld_"]'
      transform: (src) -> src.replace(/img\/ld_/g, 'img/hd-img/hd_')
      afterLoad: ->
        self = @
        $(self.imagesSelector).each ->
          currentNode = $(@)
          lowsrc = currentNode.attr 'src'
          Logger.debug "Swaping to '#{lowsrc}' HD version"
          currentNode.attr 'src', self.transform(lowsrc)
    ).load()

    new ImageLoader(
      imagesSelector: '#css-hd-images i'
      srcAttr: 'data-src'
      afterLoad: ->
        $('#css-hd-images').remove()
        $('html').addClass 'hd'
    ).load()

  # Loading decorations

  loadDecorations = ->
    lightCandle = (id, delay)->
      setTimeout(
        ->
          $("#candle#{id}")
          .children('img')
          .css(
              visibility: 'visible'
            ).siblings('.shadow')
          .css(
              opacity: 0.8
            ).siblings('.light')
          .css(
              opacity: 1
            )

        delay
      )


    new ImageLoader(
      imagesSelector: '.candle img'
      afterLoad: ->
        $('.candle').each (candleIndex)->
          lightCandle(
            candleIndex + 1
            (candleIndex + 1) * 500 + 1000
          )
    ).load()

    new ImageLoader(
      imagesSelector: '#compass'
      afterLoad: ->
        $(@imagesSelector).css(
          visibility: 'visible'
          opacity: 1
        )
    ).load()


  # Loading book pictures in background

  loadBookPictures = ->
    new ImageLoader(imagesSelector: '.snapshot.pyro').load()
    new ImageLoader(
      imagesSelector: '.snapshot.controls'
      srcAttr: 'data-colors'
    ).load()


  # Loading video hd snapshot in background

  loadSnapshots = ->
    new ImageLoader(
      imagesSelector: '#snapshot-loader i'
      srcAttr: 'data-src'
      afterLoad: ->
        $('#snapshot-loader').remove()
    ).load()


  # Loading images

  afterLoad = ->
    $('#image-loader').remove()
    $('body').addClass('bg')
    book.show()
    window.parent?.postMessage(
      'bookready'
      currentDomain
    )

  afterSingleLoad =
    'fabric-pattern': ->
      $('body').addClass('cloth')

  new ImageLoader(
    imagesSelector: '#image-loader i'
    srcAttr: 'data-src'
    afterLoad: afterLoad
    afterSingleLoad: afterSingleLoad
  ).load()

  # Page loaded

  $(window).load ->
    loadHDImages()
    loadDecorations()
    loadBookPictures()
    loadSnapshots()
