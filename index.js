const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// pharmacy products api routes
app.use('/api/products/pharmacy', require('./routes/api/products/pharmacy'));

// non pharmacy products api routes
app.use('/api/products/nonPharmacy', require('./routes/api/products/nonPharmacy'));

// index route
app.get('/', (req, res) => {
    res.send('Welcome to Inventory Management System Server');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});