const Task = require('data.task')
const { curry } = require('ramda')
const request = require('request')

// getJSON :: {} -> String -> Task JSON
const getJSON = curry((headers, url) =>
  new Task((reject, resolve) => {
    request({url, headers}, (error, response, body) =>
      error ? reject(error) : resolve(body))
  }))

// postJSON :: {} -> String -> {} -> Task JSON
const postJSON = curry((headers, url, form) =>
  new Task((reject, resolve) => {
    request({url, headers, method: 'POST', form}, (error, response, body) =>
      error ? reject(error) : resolve(body))
  }))

module.exports = {
  getJSON,
  postJSON
}
