require('dotenv').config({path:'../.env'});
const fs = require('fs');
const pg = require('pg');
const dbConnection = process.env.DB_URL;

const songList = './data/songList.tsv'

const insertSongs = (songNameSheet) => {
  fs.readFile(songNameSheet, 'utf-8', (err, data) => {
    let songs = data.split('\n');
    songs.shift(); // Removes headers.
    const client = new pg.Client(dbConnection);
    client.connect((err) => {

      if (err) {
        return console.error('!! Error !!', err);
      }

      let counter = 0;
      songs.forEach(song => {
        const info = song.split('\t');
        const title = info[0];
        const genre = info[1];
        const composer = info[2];
        const visualizer = info[3];
        const vocal = info[4][0] !== '—' ? info[4] : 'N/A';
        const dlc = info[5].toLowerCase().includes('dlc');

        const query = `
          INSERT INTO songs (name, genre, composer, visualizer, vocal, dlc)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;

        const values = [title, genre, composer, visualizer, vocal, dlc];

        client.query(query, values)
          .then(() => {
            counter++;

            console.log(`Item ${counter} / ${songs.length} inserted`);

            if (counter === songs.length) {
              console.log('Insertion complete');
              client.end();
            }

          });

      });

    });

  });
};


insertSongs(songList)