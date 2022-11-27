require('dotenv').config();
const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql').graphqlHTTP;
const PORT = process.env.PORT || 5000;
const dbConnection = process.env.DB_URL;

const axios = require('axios');
const pg = require('pg');
// GraphQL Component Imports. //
const {
  GraphQLSchema,
  GraphQLObjectType,
  graphql,
  getDescription,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');

//Returns an Array of Song Objects
const getSongs = async (args) => {
  let songs;
  const client = new pg.Client(dbConnection);
  await client.connect()
  .catch((err) => console.log('Error connecting to DB', err));
  let query = 'Select * from songs';
  const values = []
  if(args.name){
    query += ` where lower(name) like lower($1)`
    values.push(`%${args.name}%`)
  }
  if(args.artist){
    if(values.length > 0){
      query += ` or lower(artist) like lower($2)`
      values.push(`%${args.artist}%`)
    }
    else{
      query += ` where lower(artist) like lower($1)`
      values.push(`%${args.artist}%`)
    }
  }


  console.log(query)
  await client.query(query, values)
    .then((res) => { songs = res.rows; })
    .then(() => client.end())
    .catch((err) => console.log('Error with query', err));
  return songs;
};
//Returns an Array of Level Objects
const getLevels = async (args) => {
  let levels;
  const client = new pg.Client(dbConnection);
  await client.connect()
    .catch((err) => console.log('Error connecting to DB', err));

  const query = 'Select * from levels';
  await client.query(query)
    .then((res) => { levels = res.rows; })
    .then(() => client.end())
    .catch((err) =>{ console.log('Error with query', err);});
  return levels;
};


// Defining Song Type //
const songType = new GraphQLObjectType({
  name: 'Song',
  description: 'This represents a DJ Max Respect V song',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    artist: { type: GraphQLString },
    dlc: { type: GraphQLBoolean }
  })
});

const levelType = new GraphQLObjectType({
  name: 'Level',
  description: 'A representation of a playthrough of a song on DJ Max Respect V. Includes: The song chosen, the button style, the difficulty mode, the amount of difficulty stars',
  fields: () => ({
    id: { type: GraphQLInt },
    button_mode: { type: GraphQLString },
    song_id: { type: GraphQLInt },
    song: {
      type: songType,
      resolve: async (level, args) => {
        const songs = await getSongs(args); //Have to pass in empty array for lack of args arg.
        return songs.find(song => song.id === level.song_id);
      }
    },
    difficulty: { type: GraphQLString },
    star_count: { type: GraphQLInt }
  })
});



// Defining RootQuery //

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    // Return all songs
    songs: {
      type: new GraphQLList(songType),
      description: 'DJ Max Respect Songs',
      args: {name:{type: GraphQLString}, artist: {type: GraphQLString}},
      resolve: async (parent, args) => {
        const songs = getSongs(args);
        return songs;
      }
    },
    // Return all levels
    levels: {
      type: GraphQLList(levelType),
      description: 'DJ Max Levels',
      resolve: async () => {
        const levels = getLevels();
        return levels;
      }
    },
    // level: {
    //   type: GraphQLList(levelType),
    //   description: 'One DJ Max Respect V level',
    //   args: { difficulty: { type: GraphQLString }},
    //   resolve: async (parent,args) => {
    //     let level;
    //     const client = new pg.Client(dbConnection);
    //     await client.connect()
    //       .catch((err) => console.log('Error connecting to DB', err));

    //     let query;
    //     let searchParam;

    //     if(args.difficulty){
    //       query = 'Select * from levels where difficulty like $1';
    //     }

    //     console.log(query)

   
    //     await client.query(query, [args.difficulty])
    //     .then((res)=>{level = res.rows})
    //     .catch((err)=>{console.log('Oops', err)})
    //     console.log(level)
    //     return level

    //   }
    // }
  })

});

// const rootMutation = new GraphQLObjectType({
//   name: 'Mutation',
//   description: 'Root Mutation',
//   fields: ()=> ({

//   })
// })

const schema = new GraphQLSchema({
  query: rootQuery,
  // mutation : rootMutation,
});

app.use('/graphql', expressGraphQL({
  graphiql: true,
  schema: schema,
}));
// app.post('/test', expressGraphQL({
//   graphiql: true,
//   schema: schema,
// }));

app.listen(PORT, () => {
  console.log('Server up');
});