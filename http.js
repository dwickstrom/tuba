const Future = require('fluture')
const { curry } = require('ramda')
const request = require('request')

// getJSON :: {} -> String -> Future JSON
const getJSON = curry((headers, url) =>
  Future((reject, resolve) => {
    request({url, headers}, (error, response, body) =>
      error ? reject(error) : resolve(body))
  }))

// postJSON :: {} -> String -> {} -> Future JSON
const postJSON = curry((headers, url, form) =>
  Future((reject, resolve) => {
    request({url, headers, method: 'POST', form}, (error, response, body) =>
      error ? reject(error) : resolve(body))
  }))

module.exports = {
  getJSON,
  postJSON
}
