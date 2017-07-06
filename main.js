const Task = require('data.task')
const { chain, last } = require('ramda')
const { List } = require('immutable-ext')
const Table = require('cli-table')
const { callSpotify } = require('./spotify')
const { callYouTube } = require('./youtube')

// parseArgs :: [a] -> [a]
const parseArgs = args =>
  args.map(arg => {
    const xs = arg.split(':')
    return xs.length > 2 ? last(xs) : arg
  })

// getArgs :: () -> Task [String]
const getArgs = () =>
  new Task((reject, resolve) =>
    resolve(List.of(...process.argv.slice(2))))

// unsafeDisplayLinks :: [String] -> ()
const unsafeDisplayLinks = xs => {
  const table = new Table({head: ['YouTube Links'], colWidths: [60]})
  xs.forEach(x => {
    table.push([x.get()])
  })
  console.log(table.toString())
}

getArgs()
.map(parseArgs)
.chain(callSpotify)
.chain(callYouTube)
.fork(_ => console.log('Video not found.'), unsafeDisplayLinks)
