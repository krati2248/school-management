const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    password: process.env.DB_PSWD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const connectDB = () =>
{
    db.connect((err) => {
        if (err) {
            console.error("MySQL connection failed:", err.message);
            process.exit(1);
        }
        else {
            console.log("mysql connected");
        }
});
}
 

module.exports ={db,connectDB};
