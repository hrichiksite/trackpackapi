const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const track_package = require('./carrier_router')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World! This is a universal tracking api. It can query data from multiple sources and return it in a unified format, because the logistics of tracking are somehow always different. The logistics industry simply doesn\'t have a standard way of doing things.')
})

app.post('/track/:trackingNumber', (req, res) => {
  const trackingNumber = req.params.trackingNumber
  const carrier = req.body.carrier.toLowerCase()
  track_package(trackingNumber, carrier)
    .then(data => res.json(data))
    .catch(err => {
      console.error(err)
      res.status(500).send('An error occurred while tracking the package')
    })
})

app.get('/track/auto/:trackingNumber', (req, res) => {
  const trackingRegex = /\b(?:(?<DHL>\d{9,10})|(?<FPX>L[A-Z0-9]{13})|(?<ASENDIA_USA>(?:AHOY|AS)[A-Z0-9]{6,}))\b/;
  const trackingNumber = req.params.trackingNumber
  const match = trackingNumber.match(trackingRegex)
  if (!match) {
    res.status(400).send('Cannot determine carrier from tracking number, please use /track/:trackingNumber with carrier parameter')
    return
  }
  const trackingId = match[0]
  const carrier = Object.keys(match.groups).find(k => match.groups[k])
  track_package(trackingId, carrier)
    .then(data => res.json(data))
    .catch(err => {
      console.error(err)
      res.status(500).send('An error occurred while tracking the package')
    })
})

app.get('/carriers', (req, res) => {
  res.json(
    { "carriers": ["asendia_usa", "4px", "dhl"] }
  )
})

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
