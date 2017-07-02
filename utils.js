const { curry, head } = require('ramda')
const Maybe = require('data.maybe')
const Future = require('fluture')

// eitherToFuture :: Either a -> Future a
const eitherToFuture = either =>
  either.fold(Future.reject, Future.of)

// maybeFuture :: Maybe a -> Future a
const maybeToFuture = maybe =>
  maybe.isNothing
  ? Future.reject()
  : Future.of(maybe.get())

// safeGet :: String -> {} -> Maybe a
const safeGet = curry((prop, obj) =>
  Maybe.fromNullable(obj[prop]))

// safeHead :: [a] -> Maybe a
const safeHead = aList =>
  Maybe.fromNullable(head(aList))

module.exports = {
  safeGet,
  safeHead,
  maybeToFuture,
  eitherToFuture,
}
