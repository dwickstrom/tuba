const Task = require('data.task')
const { curry } = require('ramda')
const request = require('request')
const { eitherToTask } = require('./utils')
const Either = require('data.either')

// parseJSON :: JSON -> Either {}
const parseJSON = Either.try(JSON.parse)

// getJSON :: {} -> String -> Task JSON
const getJSON = curry((headers, url) =>
  Http.get(headers, url)
  .map(parseJSON)
  .chain(eitherToTask))

// postJSON :: {} -> String -> {} -> Task JSON
const postJSON = curry((headers, url, payload) =>
  Http.post(headers, url, payload)
  .map(parseJSON)
  .chain(eitherToTask))


const Http = {
  get: (headers, url) =>
    new Task((reject, resolve) => {
      request({url, headers}, (error, response, body) =>
        error ? reject(error) : resolve(body))
    }),
  post: (headers, url, form) =>
    new Task((reject, resolve) => {
      request({url, headers, method: 'POST', form}, (error, response, body) =>
        error ? reject(error) : resolve(body))
    })
}

module.exports = {
  getJSON,
  postJSON
}
