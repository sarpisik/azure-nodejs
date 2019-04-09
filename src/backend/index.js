const express = require('express')
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize')
const port = process.env.PORT || 8080
const db = require('./db/mongo')
const sessionUtil = require('./utility/session')
const log = require('./logger')

db.OpenDB()
  .then(result => {
    log.info('DB CONNECTION OK. ', result)
    const app = express()

    app.use(bodyParser.json())
    app.use(mongoSanitize({ replaceWith: '_' }))

    //request response logger middleware
    app.use(function(req, res, next) {
      const send = res.send
      res.send = function(data) {
        log.info('Response:' + data + '\n\n')
        send.call(this, data)
      }
      log.info('function: ' + req.url)
      log.info('Request' + JSON.stringify(req.body))
      next()
    })

    app.post(['/api/open', '/api/open*'], (request, response, next) => {
      // Convert html req path into local file path
      //  and require the function of this path which is a login function
      const requestRedirect = require('./api/open' +
        request.url.replace('/api/open', ''))
      requestRedirect(request, response)
        .then(result => {
          response.json(result)
          next()
        })
        .catch(err => {
          response.json(err)
          next()
        })
    })

    app.post(['/api/auth', '/api/auth*'], (request, response, next) => {
      const requestRedirect = require('./api/auth' +
        request.url.replace('/api/auth', ''))
      const { username, session } = request.body
      if (username && session) {
        sessionUtil
          .checkSession(session, username)
          .then(() => {
            requestRedirect(request, response)
              .then(result => {
                response.json(result)
                next()
              })
              .catch(err => {
                response.json(err)
                next()
              })
          })
          .catch(err => {
            response.json(err)
            next()
          })
      } else {
        response.json({ result: false, message: 'Incorrect session.' })
        next()
      }
    })

    //General Error Logger..
    app.use((err, req, res, next) => {
      if (err) {
        log.error('General Error:')
        log.error(err.stack)
      }
      res.json({ message: 'Global Error Occurred' })
      next()
    })

    app.listen(port, () => {
      log.info('App initialized')
    })
  })
  .catch(err => {
    log.error('DB ERROR: ', err)
  })
