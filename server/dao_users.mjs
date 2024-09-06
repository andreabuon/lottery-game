/* Data Access Object (DAO) module for accessing users data */

import db from "./db.mjs";
import crypto from "crypto";

export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else if (row === undefined) {
                resolve(false);
                return;
            }
            else {
                const user = { user_id: row.user_id, username: row.username, score: row.score };

                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)){
                        resolve(false);
                        return;
                    }
                    else{
                        resolve(user);
                        return;
                    }
                });
            }
        });
    });
};

export const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else if (row === undefined) {
                resolve(null);
                return;
            }
            else {
                const user = { user_id: row.user_id, username: row.username, score: row.score };
                resolve(user);
                return;
            }
        });
    });
};

export const updateUserScore = (user_id, new_score) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET score = ? WHERE user_id = ?';
        db.run(sql, [new_score, user_id], (err) =>{
            if(err){
                reject(err);
                return;
            }
            resolve();
            return;
        });
    });
};

export const getBestScores = () => {    
return new Promise((resolve, reject) => {
    const sql = 'SELECT username, score FROM users ORDER BY score DESC LIMIT 3';
    db.all(sql, [], (err, rows) => {
        if (err) {
            reject(err);
            return;
        }
        else if (rows === undefined) {
            //resolve({ error: 'Scores not found!' });
            reject('No scores have been found in the DB');
            return;
        }
        else {
            rows.map((row) => ({username: row.username, score: row.score }));
            resolve(rows);
            return;
        }
    });
});
}