const CLIENT_ID = 'b03740660cad4846b28ed45a6760ab69'
const CLIENT_SECRET = '406d9c93c11b417b9ab3f9f9d59b9247'

const Future = require('fluture')
const { is, liftN, curry, compose, map, traverse, prop, concat, head } = require('ramda')
const { List } = require('immutable-ext')
const request = require('request')
const Either = require('data.either')
const { Maybe, Just, None } = require('data.maybe')

const tap = x => {console.log(x); return x;}

// parseArgs :: [a] -> [a]
const parseArgs = args => List.of(...args.slice(2))


// getArgs :: () -> Future [String]
const getArgs = () =>
  Future((reject, resolve) =>
    resolve(parseArgs(process.argv)))


const authHeader =
  Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

// getJSON :: {} -> String -> Future JSON
const getJSON = curry((headers, url) =>
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


const cacheAccessToken = res => res

const getAccessToken = () =>
  postJSON('https://accounts.spotify.com/api/token',
            {Authorization: 'Basic '+authHeader},
            {grant_type: 'client_credentials'})
  .map(JSON.parse)
  .map(cacheAccessToken)

// safeGet :: String -> {} -> Maybe
const safeGet = curry((prop, obj) =>
  obj[prop] !== undefined ? Either.Right(obj[prop]) : Either.Left('Nothing.'))

// safeHead :: [a] -> Maybe a
const safeHead = list =>
  is(Array, list) && list.length > 1
  ? Just(head(list))
  : None

const trackUrl = id => `https://api.spotify.com/v1/tracks/${id}`
const bearerTokenHeader = token =>
({
  Authorization: `Bearer ${token}`
})

const eitherToFuture = either =>
  either.fold(Future.reject, Future.of)

// getTrackInfo :: String -> String -> Future JSON
const getTrackInfo = curry((trackId, accessToken) =>
  getJSON(bearerTokenHeader(accessToken), trackUrl(trackId)))

// contactSpotify :: String -> Future JSON
const contactSpotify = trackId =>
  getAccessToken()
  .map(safeGet('access_token'))
  .chain(eitherToFuture)
  .chain(getTrackInfo(trackId))

const maybeToFuture = maybe =>
  maybe.isNothing()
  ? Future.reject()
  : Future.of(maybe.get())

// start :: [String] -> [String]
const run = songs =>
  songs
  .traverse(Future.of, contactSpotify)
  .map(map(compose(
    // eitherToFuture,
    youTubeSearchTerm,
    JSON.parse)))

const searchTerm = curry((artist, trackName) =>
  `${artist} ${trackName}`)

// youTubeSearchTerm :: {} -> Maybe String
const youTubeSearchTerm = response =>
  Either.of(searchTerm)
  .ap(getFirstTrackArtist(response))
  .ap(getTrackName(response))

// getTrackName :: {} -> Maybe String
const getTrackName = response => safeGet('name', response)

// getFirstTrackArtist :: {} -> Maybe String
const getFirstTrackArtist = response => {
  const artist = safeGet('artist', response)
  return artist.isNothing
  ? None
  : safeHead(artist)
}

getArgs()
.chain(run)
// .map(x => x.map(JSON.parse))
.fork(console.log, x => console.log(JSON.stringify(x, null, 4)))
