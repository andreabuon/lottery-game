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
            resolve(this.lastID - 1 ); //FIXME
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
        db.run(sql, [round, JSON.stringify([...draw.numbers])], function(err){
            if (err) {
                reject(err);
                return;
            }
            //console.log(`[Round ${round}] ` + "Added a new draw [" + [...draw.numbers] + "] in the DB");
            resolve();
            return;
        });
    });
};

export function addBet(round, bet){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO bets (bet_round_num, user_id, bet_numbers) VALUES (?, ?, ?);';
        db.run(sql, [round, bet.user_id, JSON.stringify(Array.from(bet.numbers))], function(err){
            if (err) {
                reject(err);
                return;
            }
            console.log(`[Round ${round}] Player ` + + bet.user_id + " made a new bet [" + [...bet.numbers] + "] in the DB.");
            resolve(round);
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
            let draw = new Draw(JSON.parse(row.draw_numbers));
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
            let draw = new Draw(JSON.parse(row.draw_numbers));
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
            let bets = rows.map( (row) => new Bet(row.user_id, JSON.parse(row.bet_numbers)));
            resolve(bets);
            return;
        });
    });
}