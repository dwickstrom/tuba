const CLIENT_ID = 'b03740660cad4846b28ed45a6760ab69'
const CLIENT_SECRET = '406d9c93c11b417b9ab3f9f9d59b9247'

const Future = require('fluture')
const { liftN, curry } = require('ramda')
const { List } = require('immutable-ext')
const request = require('request')

// parseArgs :: [a] -> [a]
const parseArgs = args => List.of(...args.slice(2))


const getArgs = () =>
  Future((reject, resolve) =>
    resolve(parseArgs(process.argv)))


const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
                   //'M2VhNjBkYmQxMWFkNDVlOGEyMDFjMzg2YzgxYzBiYmY6MWNkYWMzODAzNjBkNGZhOWEzZjc3ZWEyZGVmOTY5MWE='

// getJSON :: String -> {} -> Future JSON
const getJSON = curry((url, headers) =>
  Future((reject, resolve) => {
    request({url, headers}, function (error, response, body) {
      if (error)
        reject(error)
      resolve(body)
    });

  }))

const postJSON = curry((url, headers, payload) =>
  Future((reject, resolve) => {
    const opts = {url:url, headers:headers, method:"POST", form: payload}
    request(opts, function(error, response, body) {
      if (error)
        reject(error)
      resolve(body)
    });
  }))

const getAccessToken = () =>
  postJSON('https://accounts.spotify.com/api/token', {
    Authorization: 'Basic '+authHeader
  },{
    grant_type: 'client_credentials'
  }).map( JSON.parse )

// getAccessToken().fork(console.log, console.log)

const getTrackInfo = track_id =>
  getAccessToken().chain( tkn => {
    const accessToken = tkn.access_token
    return getJSON("https://api.spotify.com/v1/tracks/"+track_id, {
      Authorization: 'Bearer '+accessToken
    })
  })

getTrackInfo("5EXguezTFoljci9ccagA5i").fork(console.log, console.log)

// start :: [String] -> Future [String]
const start = songs =>
  songs.map(x => x.toUpperCase())

//console.log(authHeader)

// getArgs()
// .map(start)
// .fork(console.log, console.log)
