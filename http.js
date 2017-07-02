const Future = require('fluture')
const { curry } = require('ramda')
const request = require('request')

// getJSON :: {} -> String -> Future JSON
const getJSON = curry((headers, url) =>
  Future((reject, resolve) => {
    request({url, headers}, (error, response, body) =>
      error ? reject(error) : resolve(body))
  }))

const postJSON = curry((url, headers, payload) =>
  Future((reject, resolve) => {
    const opts = {url:url, headers:headers, method: "POST", form: payload}
    request(opts, (error, response, body) =>
      error ? reject(error) : resolve(body))
  }))

module.exports = {
  getJSON,
  postJSON
}
