const {db,connectDB} = require('../database/dbConnect');

class schoolController {
    static addSchool = async (req, res) => {
        try {
            const { name, address, latitude, longitude } = req.body;
            //Checking required fields
            if (!name || !address || !latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    message: "All fields (name, address, latitude, longitude) are required"
                });
            }

            //Checking type (must be numbers)
            const userLat = parseFloat(latitude);
            const userLng = parseFloat(longitude);

            if (isNaN(userLat) || isNaN(userLng)) {
                return res.status(400).json({
                    success: false,
                    message: "Latitude and longitude must be valid numbers"
                });
            }

            //Check valid latitude & longitude ranges
            if (userLat < -90 || userLat > 90) {
            return res.status(400).json({
                success: false,
                message: "Latitude must be between -90 and 90"
            });
        }
        if (userLng < -180 || userLng > 180) {
            return res.status(400).json({
                success: false,
                message: "Longitude must be between -180 and 180"
            });
            }
            

            //Checking duplicates
            const checkQuery = "SELECT * FROM schools WHERE name = ? AND address = ?";
            db.query(checkQuery, [name, address], (err, rows) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Database error",
                        error: err.message
                    });
                }

                if (rows.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Duplicate entry: This school already exists"
                    });
                }

                //Inserting school
                const sq = "insert into schools (name,address,latitude,longitude) values (?,?,?,?)";
                db.query(sq, [name, address, latitude, longitude], (er, dt) => {
                    if (er) {
                        console.log(er);
                        return res.status(500).json({
                            success: false,
                            message: "Database error",
                            error: er.message
                        });
                    }
                    return res.status(201).json({
                        success: true,
                        message: "school added successfully",
                         
                    })
                })
            })
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Server error"
            })
        }
    }
    static listSchools = async (req, res) =>
    {
        try
        {
            const { latitude, longitude } = req.query;

            //checking query parameters
            if (!latitude || !longitude)
            {
                return res.status(400).json({
                    success: false,
                    message:"Latitude and longitude query parameters are required"
                })
            }

            const userLat = parseFloat(latitude);
            const userLng = parseFloat(longitude);
            if (isNaN(userLat) || isNaN(userLng)) {
                return res.status(400).json({
                    success: false,
                    message: "Latitude and longitude must be valid numbers"
                });
            }

            const sql = "select * from schools";
            db.query(sql, (er, dt) => {
                if (er) {
                    console.log(er);
                    return res.status(500).json({
                        success: false,
                        message: "Database error",
                        error: er.message
                    });
                }
                
                //calculating distance
                const schoolwithDistance = dt.map((school) => {
                    const dist = schoolController.getDistance(
                        userLat, userLng,
                        parseFloat(school.latitude), parseFloat(school.longitude)
                    )
                    return { ...school, calculatedDistanceKm: dist.toFixed(2) };
                });
                schoolwithDistance.sort((a, b) => a.distance - b.distance);
                return res.status(200).json({
                    success: true,
                    schools:schoolwithDistance
                })
            });
            
        }
        catch (er)
        {
            console.log(er);
            res.status(500).json({
                success: false,
                message: "Server error"
            })
        }
    }
    static getDistance(userLat,userLng, lat, lng)
    {
        //Earth’s radius in kilometers
        const radius = 6371;
        const dLat = (lat - userLat) * Math.PI / 180;
        const dLng = (lng - userLng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radius * c;

    }
}
module.exports = schoolController;
