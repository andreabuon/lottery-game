import db from "./db.mjs";

export function addDraw(draw) {
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
        const sql = 'SELECT n1, n2, n3, n4, n5 FROM draws ORDER BY draw_id DESC LIMIT 1;';
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