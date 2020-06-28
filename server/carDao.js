
// DAO module for accessing tasks
// Data Access Object 

// Using SQLite
const sqlite = require('sqlite3');
const db = require('./db');

exports.carExistsAndFree = function (rental) {
    return new Promise ((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as n FROM Car WHERE id=? AND ? NOT IN (SELECT car_id FROM Rental WHERE (Date(?)<=DATE(start_date) AND Date(?)>=DATE(start_date)) OR (Date(?)<=DATE(end_date) AND Date(?)>=DATE(end_date)) OR (Date(?)>=DATE(start_date) AND Date(?)<=DATE(end_date)))';
        db.all(sql, [rental.carId, rental.carId, rental.startDate, rental.endDate, rental.startDate, rental.endDate, rental.startDate, rental.endDate], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row[0].n===1 ? true : false);
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
        const sql = 'SELECT id, brand, model, category, seats, fuel, price FROM Car WHERE category=? AND id NOT IN (SELECT car_id FROM Rental WHERE (Date(?)<=DATE(start_date) AND Date(?)>=DATE(start_date)) OR (Date(?)<=DATE(end_date) AND Date(?)>=DATE(end_date)) OR (Date(?)>=DATE(start_date) AND Date(?)<=DATE(end_date)))';
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
        const sql = 'SELECT id, brand, model, category, seats, fuel, price FROM Car WHERE id NOT IN (SELECT car_id FROM Rental WHERE (Date(?)<=DATE(start_date) AND Date(?)>=DATE(start_date)) OR (Date(?)<=DATE(end_date) AND Date(?)>=DATE(end_date)) OR (Date(?)>=DATE(start_date) AND Date(?)<=DATE(end_date)))';
        db.all(sql, [start, end, start, end, start, end], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let cars = rows;
            resolve(cars);
        });
    });
};

