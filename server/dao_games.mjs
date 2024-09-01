import db from "./db.mjs";
import { Draw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

export function addRound(){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO rounds (round_num) VALUES (null)';
        db.run(sql, [], function(err){
            if (err) {
                reject(err);
            }
            resolve(this.lastID - 1 ); //FIXME
            //console.log("Added a new round " + this.lastID + " in the DB");
        });
    });
};

export function getRound(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM rounds ORDER BY round_num DESC LIMIT 1;';
        db.get(sql, [], function(err, row){
            if (err) {
                reject(err);
            }
            if(row === undefined){
                reject(new Error('No round has been found'));
                //resolve(null);
            }
            resolve(row.round_num);
        });
    });
};

export function addDraw(round, draw) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO draws (draw_round_num, draw_numbers) VALUES (?, ?);';
        db.run(sql, [round, JSON.stringify([...draw.numbers])], function(err){
            if (err) {
                reject(err);
            }
            //console.log("Added a new draw [" + [...draw.numbers] + "] in the DB with ID: ", draw_ID);
            resolve();
        });
    });
};

export function addBet(round, bet){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO bets (bet_round_num, user_id, bet_numbers) VALUES (?, ?, ?);';
        db.run(sql, [round, bet.user_id, JSON.stringify(Array.from(bet.numbers))], function(err){
            if (err) {
                reject(err);
            }
            //console.log("User " + bet.user_id + " added a new bet [" + [...bet.numbers] + "] in the DB for the round " + round);
            resolve(round);
        });
    });
}

export function getDrawByRound(round){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM draws WHERE draw_round_num = ?;';
        db.get(sql, [round], function(err, row){
            if (err) {
                reject(err);
            }
            if(row === undefined){
                reject(new Error('No draw has been found'));
                //resolve(null);
            }
            let draw = new Draw(JSON.parse(row.draw_numbers)); //FIXME
            resolve(draw);
        });
    });
}

export function getLastDraw(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM draws ORDER BY draw_round_num DESC LIMIT 1;';
        db.get(sql, [], function(err, row){
            if (err) {
                reject(err);
            }
            if(row === undefined){
                reject(new Error('No draw has been found'));
                //resolve(null);
            }
            let draw = new Draw(JSON.parse(row.draw_numbers)); //FIXME
            resolve(draw);
        });
    });
}

export function getRoundBets(round){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM bets WHERE bet_round_num = ?;';
        db.all(sql, [round], function(err, rows){
            if (err) {
                reject(err);
            }
            if(rows === undefined){
                //reject(new Error('No bets have been found'));
                resolve([]); //FIXME
            }
            let bets = rows.map( (row) => new Bet(row.user_id, JSON.parse(row.bet_numbers)));
            resolve(bets);
        });
    });
}