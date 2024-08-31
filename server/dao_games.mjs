import db from "./db.mjs";
import { Draw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

export function addDraw(draw) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO draws VALUES (NULL, ?);';
        db.run(sql, [JSON.stringify(draw.numbers)], function(err){
            if (err) {
                reject(err);
            }
            //console.log("Added a new draw [" + [...draw.numbers] + "] in the DB with ID: ", draw_ID);
            resolve(this.lastID);
        });
    });
}

export function addBet(bet){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO bets VALUES (?, ?);';
        db.run(sql, [bet.user_id, JSON.stringify(bet.numbers)], function(err){
            if (err) {
                reject(err);
            }
            //console.log("User " + bet.user_id + " added a new bet [" + [...bet.numbers] + "] in the DB");
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
            if(row === undefined){
                //reject('No draw has been found');
                resolve([]);
            }
            let draw = JSON.parse(row.draw_numbers); //FIXME
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
            if(rows === undefined){
                //reject('No bets have been found');
                resolve([]);
            }
            let bets = rows.map( (row) => new Bet(row.user_id, JSON.parse(row.bet_numbers)));
            resolve(bets);
        });
    });
}

export function deleteBets(){
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM bets WHERE 1=1;';
        db.run(sql, function(err){
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}