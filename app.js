require('dotenv').config()
const express = require('express');
const app = express();

app.use(express.json())

const driverRoutes = require('./routes/driverRoutes');
const parcelRoutes = require('./routes/parcelRoutes');
const errorHandler = require('./middleware/errorHandler');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

app.use('/drivers', driverRoutes)
app.use('/parcels', parcelRoutes)
app.use('/maintenance', maintenanceRoutes)

app.use(errorHandler)
port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`)
})