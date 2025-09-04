const express = require('express');
const schoolController = require('../controllers/schoolController');
const route = express.Router();


route.post("/addSchool", schoolController.addSchool);
route.get("/listSchools", schoolController.listSchools);


module.exports = route;

