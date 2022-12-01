require('dotenv').config({path: '../.env'})
const fs = require('fs')
const levelDataRoot = './data/'
const levelSheets = []

const insertLevels = (levelSheet) => {
  fs.readFile(levelSheet, 'utf-8', (err, data)=>{
    test = data.split('\n');
    test.shift()
    console.log(test.slice(0,6))
  })
}

insertLevels('./data/4buttons.tsv')
