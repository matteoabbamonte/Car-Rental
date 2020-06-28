// DAO module for accessing rentals
// Data Access Object 

// Using SQLite
const sqlite = require('sqlite3');
const db = require('./db');

exports.registerRental = function (rentalObj) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Rental(car_id, user_id, start_date, end_date, price) VALUES(?, ?, ?, ?, ?)';
        db.run(sql, [rentalObj.carId, rentalObj.userId, rentalObj.startDate, rentalObj.endDate, rentalObj.price], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

exports.getRentals = function (extended, userId) {
    var query;
    if (extended === 'true') {
        query = 'SELECT brand, model, start_date, end_date, Rental.price FROM Car, Rental WHERE user_id=? AND car_id=id';
    } else {
        query = 'SELECT * FROM Rental WHERE user_id=?';
    }
    return new Promise((resolve, reject) => {
        const sql = query;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let rentals = rows.map((r) => ({ ...r }));
            resolve(rentals);
        });
    });
}

exports.deleteRental = function (rentalObj, userID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Rental WHERE user_id=? AND start_date=? AND end_date=? AND car_id=(SELECT id FROM Car WHERE brand=? AND model=?)';
        db.run(sql, [userID, rentalObj.startDate, rentalObj.endDate, rentalObj.carBrand, rentalObj.carModel], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};