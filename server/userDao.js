// DAO module for accessing users
// Data Access Object 

// Using SQLite
const sqlite = require('sqlite3');
const db = require('./db');
const bcrypt = require('bcrypt');


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

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name FROM User WHERE id = ?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0) {
                reject(null);
                return;
            }
            resolve({
                userId: rows[0].id,
                userName: rows[0].name,
            });
        });
    });
};