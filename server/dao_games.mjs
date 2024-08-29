import db from "./db.mjs";

export function addDraw(draw) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO draws VALUES (NULL, ?);';
        db.run(sql, [JSON.stringify(draw)], function(err){
            if (err) {
                reject(err);
            }
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
            resolve(row);
        });
    });
}