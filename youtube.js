const { chain, compose, curry, map } = require('ramda')
const { safeProp, safeHead , maybeToFuture, eitherToMaybe } = require('./utils')
const { getJSON } = require('./http')
const Future = require('fluture')
const Maybe = require('data.maybe')
const Either = require('data.either')
const { getFirstTrackArtist, getTrackName } = require('./spotify')

const YT_API_KEY = 'AIzaSyDg2dAih1lnlTL6kh6yuoEMnpnpcDntECk'

// youTubeSearchTerm :: {} -> Maybe String
const youTubeSearchTerm = response =>
  Maybe.of(artist => trackName => `${artist} ${trackName}`)
  .ap(getFirstTrackArtist(response))
  .ap(getTrackName(response))

// youtubeUrl :: String -> String
const youtubeUrl = term => {
  return `https://content.googleapis.com/youtube/v3/search?q=${term}&maxResults=5&part=snippet&key=${YT_API_KEY}`
}

// constructYouTubeUrl :: String -> String
const constructYouTubeUrl = id =>
  `https://www.youtube.com/watch?v=${id}`

// parseYouTubeId :: {} -> String
const parseYouTubeId = compose(
  map(constructYouTubeUrl),
  chain(safeProp('videoId')),
  chain(safeProp('id')),
  chain(safeHead),
  safeProp('items')
)

const tap = x => {
  console.log(x)
  return x
}

// parseJSON :: JSON -> Either {}
const parseJSON = Either.try(JSON.parse)

// parseYouTubeResponse :: String -> Maybe URL
const parseYouTubeResponse = compose(
  chain(parseYouTubeId),
  eitherToMaybe,
  parseJSON)

// contactYouTube :: [String] -> [URL]
const contactYouTube =
  compose(
    map(parseYouTubeResponse),
    chain(getJSON({})),
    map(youtubeUrl),
    maybeToFuture,
    youTubeSearchTerm)

// callYouTube :: [{}] -> Future [String]
const callYouTube = tracks =>
  tracks.traverse(Future.of, contactYouTube)

module.exports = {
  callYouTube
}
