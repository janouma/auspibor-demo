(function protect () {
  'use strict'
  var PASSWORD = 'boregor'
  var PATTERN = /\bpassword\s*=\s*(.*?)(;|$)/
  var MAX_ATTEMPT = 3
  var PROMPT_TEXT = 'Enter password'
  var FORBIDDEN_URL = '403.html'
  var testResults
  var autoPass
  var query = window.top.document.location.search.substring(1)
  var parsedQuery
  var input
  var attempt = 0
  var expirationDate

  console.debug(query)

  if (query) {
    parsedQuery = query.split('&').map(function (param) { return param.split('=') })

    parsedQuery.some(function (paramTuple) {
      console.debug(paramTuple)
      if (paramTuple[0] === 'password') {
        console.debug('auto pass')
        autoPass = paramTuple[1]
        return true
      }
    })
  }

  if (!autoPass) {
    testResults = PATTERN.exec(document.cookie)
    autoPass = testResults && testResults[1]
  }

  if (autoPass !== PASSWORD) {
    while (attempt++ < MAX_ATTEMPT) {
      if (input = prompt(PROMPT_TEXT, '')) {
        if (input === PASSWORD) {
          console.debug('password accepted')
          expirationDate = new Date()
          expirationDate.setTime(expirationDate.getTime() + 30 * 24 * 60 * 60 * 1000)
          document.cookie = 'password=' + input + ';path=/;expires=' + expirationDate.toUTCString()
          return
        }
      } else {
        document.location.replace(FORBIDDEN_URL)
        return
      }
    }
    console.error('access denied')
    document.location.replace(FORBIDDEN_URL)
  }
})()

