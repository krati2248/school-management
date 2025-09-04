const express = require('express');
const app = express();
const connectDB = require('./database/dbConnect');
const web = require('./routes/web');
require('dotenv').config();
 
 
app.use(express.json());
app.use('/', web);

connectDB();

app.listen(process.env.PORT||3000, () =>
{
    console.log(`Server running on port ${process.env.PORT || 3000}`);
})

