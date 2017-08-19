const { chain, compose, curry, map } = require('ramda')
const { safeProp, safeHead , maybeToTask, eitherToMaybe, maybeToEither, eitherToTask } = require('./utils')
const { getJSON } = require('./http')
const Task = require('data.task')
const Maybe = require('data.maybe')
const Either = require('data.either')
const { getFirstTrackArtist, getTrackName } = require('./spotify')

const YT_API_KEY = 'AIzaSyDg2dAih1lnlTL6kh6yuoEMnpnpcDntECk'

// youTubeSearchTerm :: {} -> Maybe String
const youTubeSearchTerm = response =>
  Maybe.of(artist => trackName => `${artist} ${trackName}`)
  .ap(getFirstTrackArtist(response))
  .ap(getTrackName(response))

// youTubeSearchUrl :: String -> String
const youTubeSearchUrl = term => {
  return `https://content.googleapis.com/youtube/v3/search?q=${term}&maxResults=5&part=snippet&key=${YT_API_KEY}`
}

// youTubeUrl :: String -> String
const youTubeUrl = id =>
  `https://www.youtube.com/watch?v=${id}`

// responseToUrl :: {} -> Either URL String
const responseToUrl = compose(
  maybeToEither('Unable to retrieve YouTube URL'),
  map(youTubeUrl),
  chain(safeProp('videoId')),
  chain(safeProp('id')),
  chain(safeHead),
  safeProp('items')
)

// contactYouTube :: Either String URL -> Task Either String URL
const contactYouTube =
  compose(
    map(responseToUrl),
    chain(getJSON({})),
    map(youTubeSearchUrl),
    eitherToTask
  )

// searchOrElse :: Either String URL -> Task Either String URL
const searchOrElse = either =>
  either.isLeft
  ? Task.of(either)
  : contactYouTube(either)


// handleYouTubing :: String -> Task Either String URL
const handleYouTubing = compose(
  searchOrElse,
  maybeToEither('Unknown track id.'),
  youTubeSearchTerm
)


// callYouTube :: [{}] -> Task [String]
const callYouTube = tracks =>
  tracks.traverse(Task.of, handleYouTubing)

module.exports = {
  callYouTube
}
