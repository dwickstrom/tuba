const Future = require('fluture')
const { chain } = require('ramda')
const { List } = require('immutable-ext')
const Table = require('cli-table')
const { callSpotify } = require('./spotify')
const { callYouTube } = require('./youtube')

// parseArgs :: [a] -> [a]
const parseArgs = args => List.of(...args.slice(2))

// getArgs :: () -> Future [String]
const getArgs = () =>
  Future((reject, resolve) =>
    resolve(parseArgs(process.argv)))


const unsafeDisplayLinks = xs => {
  const table = new Table({head: ['YouTube Links'], colWidths: [60]})
  xs.forEach(x => {
    table.push([x.get()])
  })
  console.log(table.toString())
}

getArgs()
.chain(callSpotify)
.chain(callYouTube)
.fork(_ => console.log('Video not found.'), unsafeDisplayLinks)
