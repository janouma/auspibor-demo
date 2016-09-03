'use strict'

const hapi = require('hapi')
const inert = require('inert')

const port = parseInt(process.env.npm_package_config_port, 10)

const server = new hapi.Server({
  debug: {
    request: ['info', 'debug']
  }
})

server.connection({ port })

server.register(inert, (error) => {
  if (error) { throw error }

  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/auspibor-demo/{file*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  })
})

server.start((error) => {
  if (error) { throw error }
  console.info(`${process.env.npm_package_name} ${process.env.npm_package_version} running at:`, server.info.uri)
})
