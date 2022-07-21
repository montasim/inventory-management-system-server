const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// products pharmacy api routes
app.use('/api/products/pharmacy', require('./routes/api/products/pharmacy'));

// products non pharmacy api routes
app.use('/api/products/nonPharmacy', require('./routes/api/products/nonPharmacy'));

// requested items pharmacy api routes
app.use('/api/requestedItems/pharmacy', require('./routes/api/requestedItems/pharmacy'));

// requested items non pharmacy api routes
app.use('/api/requestedItems/nonPharmacy', require('./routes/api/requestedItems/nonPharmacy'));

// orders pharmacy api routes
app.use('/api/orders/pharmacy', require('./routes/api/orders/pharmacy'));

// orders non pharmacy api routes
app.use('/api/orders/nonPharmacy', require('./routes/api/orders/nonPharmacy'));

// orders pharmacy api routes
app.use('/api/purchases/pharmacy', require('./routes/api/orders/pharmacy'));

// orders non pharmacy api routes
app.use('/api/purchases/nonPharmacy', require('./routes/api/orders/nonPharmacy'));

// categories api routes
app.use('/api/categories', require('./routes/api/categories/categories'));

// companies api routes
app.use('/api/companies', require('./routes/api/companies/companies'));

// companies api routes
app.use('/api/unitTypes', require('./routes/api/unitTypes/unitTypes'));

// index route
app.get('/', (req, res) => {
    res.send('Welcome to Inventory Management System Server');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});