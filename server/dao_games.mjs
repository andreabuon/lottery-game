import db from "./db.mjs";
import { Draw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

export function addRound(){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO rounds (round_num) VALUES (null)';
        db.run(sql, [], function(err){
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID); //FIXME ci va il -1?
            //console.log("Added a new round in the DB");
            return;
        });
    });
};

export function getRound(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM rounds ORDER BY round_num DESC LIMIT 1;';
        db.get(sql, [], function(err, row){
            if (err) {
                reject(err);
                return;
            }
            if(row === undefined){
                reject(new Error('No round has been found'));
                //resolve(null);
            }
            resolve(row.round_num);
            return;
        });
    });
};

export function addDraw(round, draw) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO draws (draw_round_num, draw_numbers) VALUES (?, ?);';
        db.run(sql, [round, JSON.stringify(draw.numbers)], function(err){
            if (err) {
                reject(err);
                return;
            }
            console.log(`[Round ${round}] ` + "Added draw " + draw.toString() + " in the DB");
            resolve();
            return;
        });
    });
};

export function addBet(bet){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO bets (bet_round_num, user_id, bet_numbers) VALUES (?, ?, ?);';
        db.run(sql, [bet.round, bet.user_id, JSON.stringify(bet.numbers)], function(err){
            if (err) {
                reject(err);
                return;
            }
            console.log(`[Round ${bet.round}] Player ` + + bet.user_id + " made a new bet [" + bet.numbers + "] in the DB.");
            resolve();
            return;
        });
    });
}

export function getDrawByRound(round){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM draws WHERE draw_round_num = ?;';
        db.get(sql, [round], function(err, row){
            if (err) {
                reject(err);
                return;
            }
            if(row === undefined){
                reject(new Error('No draw has been found'));
                //resolve(null);
            }
            let draw = new Draw(JSON.parse(row.draw_numbers), row.round_num);
            resolve(draw);
            return;
        });
    });
}

export function getLastDraw(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM draws ORDER BY draw_round_num DESC LIMIT 1;';
        db.get(sql, [], function(err, row){
            if (err) {
                reject(err);
                return;
            }
            if(row === undefined){
                reject(new Error('No draw has been found'));
                //resolve(null);
                return;
            }
            let draw = new Draw(JSON.parse(row.draw_numbers), row.draw_round_num);
            resolve(draw);
            return;
        });
    });
}

export function getRoundBets(round){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM bets WHERE bet_round_num = ?;';
        db.all(sql, [round], function(err, rows){
            if (err) {
                reject(err);
                return;
            }
            if(rows === undefined){
                //reject(new Error('No bets have been found'));
                resolve([]);
                return;
            }
            let bets = rows.map( (row) => new Bet(row.bet_round_num, row.user_id, JSON.parse(row.bet_numbers)));
            resolve(bets);
            return;
        });
    });
}

export function addResult(round, user_id, score){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO results (round_num, user_id, score) VALUES (?, ?, ?);';
        db.run(sql, [round, user_id, score], function(err){
            if (err) {
                reject(err);
                return;
            }
            resolve();
            return;
        });
    });
}

export function getResult(round, user_id){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM results WHERE round_num = ? AND user_id = ?';
        db.get(sql, [round, user_id], function(err, row){
            if (err) {
                reject(err);
                return;
            }
            if(row === undefined){
                //reject(new Error('No result has been found'));
                resolve(null);
                return;
            }
            resolve(row.score);
            return;
        });
    });
}