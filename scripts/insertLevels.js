require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const pg = require('pg');
const dbConnection = process.env.DB_URL;
const levelDataRoot = './data/';
const levelSheets = [];

const insertLevels = (levelSheet) => {
  fs.readFile(levelSheet, 'utf-8', (err, data) => {
    console.log(String(levelSheet).slice(7,-4))
    levels = data.split('\n');
    // levels.shift(); // Remove headers
    console.log(levels[13].replace('\r', '').split('\t'))
    // const client = new pg.Client(dbConnection);
    // client.connect((err) => {
    //   if (err) {
    //     return console.error('!! Error !!', err);
    //   }

    //   let counter = 0;
    //   levels.forEach(level => {
    //     const info = level.replace('\r', '').split('\t');
    //     const songName = info[0];
    //     const pack = info[1];
    //     const normal = info[2];
    //     const hard = info[3];
    //     const maximum = info[4];
    //     const sc = info[5];

    //     const query = `
    //     INSERT INTO levels(button_mode, song_id, difficulty, star_count) 
    //     VALUES ('4 button', (Select id from songs where lower(name) like '%armored phantom%'), 'normal', 3)
    //     ` // Currently a template.

    //     const values = []
    //   });





    //   })





    });
  }

insertLevels('./data/4 buttons.tsv');
