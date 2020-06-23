
// DAO module for accessing tasks
// Data Access Object 

// Using SQLite
const sqlite = require('sqlite3');
const db = require('./db');
const moment = require('moment');
const bcrypt = require('bcrypt');

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

exports.getCarsByCategoryAndBrand = function (categories, brands) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Car';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let cars = [];
            if (categories == "none" && brands == "none") {
                cars = [...rows];
            } else {
                let carsCat = [];
                for (const cat of categories) {
                    carsCat = [...carsCat, ...rows.filter((c) => { return c.category == cat })]
                }
                let carsBr = [];
                for (const br of brands) {
                    carsBr = [...carsBr, ...rows.filter((c) => { return c.brand == br })]
                }
                if (carsCat.length != 0 && carsBr.length != 0) {
                    for (var cC of carsCat) {
                        for (var cB of carsBr) {
                            if (cC.id == cB.id) {
                                cars.push(cC);
                            }
                        }
                    }
                } else if (carsCat.length != 0) {
                    cars = carsCat;
                } else {
                    cars = carsBr;
                }
            }
            resolve(cars);
        });
    });
};

exports.getCarsByCategoryAndPeriod = function (category, period) {
    var start = period[0];
    var end = period[1];
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, brand, model, category, seats, fuel, price FROM Car WHERE category=? AND id NOT IN (SELECT car_id FROM Rental WHERE (Date(?)<DATE(start_date) AND Date(?)>DATE(start_date)) OR (Date(?)<DATE(end_date) AND Date(?)>DATE(end_date)) OR (Date(?)<DATE(start_date) AND Date(?)>DATE(end_date)))';
        db.all(sql, [category, start, end, start, end, start, end], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let cars = rows;
            resolve(cars);
        });
    });
};

exports.getCarsByPeriod = function (period) {
    var start = period[0];
    var end = period[1];
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Car WHERE id NOT IN (SELECT car_id FROM Rental WHERE (DATE(?)<DATE(start_date) AND DATE(?)>DATE(start_date)) OR (DATE(?)<DATE(end_date) AND DATE(?)>DATE(end_date)) OR (DATE(?)<DATE(start_date) AND DATE(?)>DATE(end_date)))';
        db.all(sql, [start, end], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let cars = rows;
            resolve(cars);
        });
    });
};

exports.checkPassword = function (email, pass) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name, password FROM User WHERE email = ?';
        db.all(sql, [email], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0) {
                reject(null);
                return;
            }
            const password = rows[0].password;
            bcrypt.compare(pass, password, function (err, res) {
                if (err)
                    reject(err);
                else {
                    if (res) {
                        resolve({
                            userId: rows[0].id,
                            userName: rows[0].name,
                        });
                    } else {
                        reject(null);
                        return;
                    }
                }
            });
        });
    });
}

exports.getRentals = function (extended, userId) {
    var query;
    if (extended==='true') {
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
            let rentals = rows.map((r) => ({...r}));
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