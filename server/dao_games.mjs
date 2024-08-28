import db from "./db.mjs";

export function insertDraw(draw) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO draws VALUES (NULL, ?, ?, ?, ?, ?);';
        db.run(sql, [...draw], function(err){
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

export function getLatestDraw(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT NUM1, NUM2, NUM3, NUM4, NUM5 FROM draws ORDER BY ID DESC LIMIT 1;';
        db.get(sql, [], function(err, row){
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

/*
export function getLastDrawID(){
    const sql = 'SELECT IDENT_CURRENT("draws")+1'; 
    db.get(sql, (err, row) => {
        if (err) {
            reject(err);
        }
        resolve(row);
    });
}

function getNextDrawID(){
    const id = getLastDrawID();
    return id+1;
}
*/

/*
export function insertBet(user, bet){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO bets VALUES (NULL, ?, ?, ?, ?, ?);';
        db.run(sql, user.id, 1, [...bet], (err, rows) => {
            if (err) {
                reject(err);
            }
        });
    });
}
*/