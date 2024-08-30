import db from "./db.mjs";

export function addDraw(draw) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO draws VALUES (NULL, ?);';
        db.run(sql, [JSON.stringify(draw)], function(err){
            if (err) {
                reject(err);
            }
            //console.log("Added a new draw [" + [...draw] + "] in the DB with ID: ", draw_ID);
            resolve(this.lastID);
        });
    });
}

export function addBet(userID, bet){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO bets VALUES (?, ?);';
        db.run(sql, [userID, JSON.stringify(bet)], function(err){
            if (err) {
                reject(err);
            }
            //console.log("User " + userID + " added a new bet [" + [...bet] + "] in the DB");
            resolve(this.lastID);
        });
    });
}

export function getLastDraw(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT draw_numbers FROM draws ORDER BY draw_id DESC LIMIT 1;';
        db.get(sql, [], function(err, row){
            if (err) {
                reject(err);
            }
            let draw = JSON.parse(row.draw_numbers);
            resolve(draw);
        });
    });
}

export function getBets(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM bets;';
        db.all(sql, [], function(err, rows){
            if (err) {
                reject(err);
            }
            let bets = rows.map( (row) => ({user_id: row.user_id, bet_numbers: JSON.parse(row.bet_numbers)}));
            resolve(bets);
        });
    });
}

export function deleteBets(){
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM bets WHERE 1=1;';
        db.run(sql, function(err, rows){
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}