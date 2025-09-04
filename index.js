const express = require('express');
const app = express();
const {db,connectDB} = require('./database/dbConnect');
const web = require('./routes/web');
require('dotenv').config();

//middleware
app.use(express.json());

//connect db
connectDB();

//routes
app.use('/', web);



app.listen(process.env.PORT||3000, () =>
{
    console.log(`Server running on port ${process.env.PORT || 3000}`);
})

