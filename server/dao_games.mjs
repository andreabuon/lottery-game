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

export function getLastDraw(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT n1, n2, n3, n4, n5 FROM draws ORDER BY ID DESC LIMIT 1;';
        db.get(sql, [], function(err, row){
            if (err) {
                reject(err);
            }
            let draw = [];
            draw.push(row.n1);
            draw.push(row.n2);
            draw.push(row.n3);
            draw.push(row.n4);
            draw.push(row.n5);
            resolve(draw);
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

export function insertBet(user, bet){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO bets VALUES (NULL, ?, ?, ?, ?, ?);';
        db.run(sql, user.id, 1, [...bet], (err) => {
            if (err) {
                reject(err);
            }
        });
    });
}
*/