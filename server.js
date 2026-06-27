const app = require('./app')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Live Logistics Engine running on port ${PORT}...`)
})