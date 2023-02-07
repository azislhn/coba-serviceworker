const express = require('express')
const webpush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())

const publicVapidKey = 'BOjcXb3H8zam6iyaNkBgGNIf2wAY-IjcwaLm93SXCVq_xlHiWGGWDExV_kw6AVd5fNTMx80rkRyAG-c3bSknvyU'
const privateVapidKey = '8heNbZ9JADyWk6rlCCDyYEW6Jcd9oSqLtci7I0WlNvU'

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

// subscribe route
app.post("/subscribe", (req, res) => {
  // get pushSubscription object
  const subs = req.body

  // send
  res.status(200).json({})

  // create payload
  const payload = JSON.stringify({title: "Push Test"})

  // pass object into sendNotification
  webpush.sendNotification(subs, payload).catch(err => console.error(err))
})

const port = 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`))
