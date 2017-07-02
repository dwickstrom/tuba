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

// eitherToMaybe :: Either a -> Maybe a
const eitherToMaybe = either =>
  either.fold(Maybe.Nothing, Maybe.Just)

// safeProp :: String -> {} -> Maybe a
const safeProp = curry((prop, obj) =>
  Maybe.fromNullable(obj[prop]))

// safeHead :: [a] -> Maybe a
const safeHead = aList =>
  Maybe.fromNullable(head(aList))

module.exports = {
  safeProp,
  safeHead,
  maybeToFuture,
  eitherToFuture,
  eitherToMaybe,
}
