const express = require('express')
const port = process.env.PORT || 8080
const app = express()

app.use(function(req, res) {
  res.json({
    message: 'Hello from azure nodejs app'
  })
})

app.listen(port, () => {
  console.log('App initialized')
})
