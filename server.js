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


// let songs;
// let levels;
// const getAllData = () => {


// }

const songs1 = [
  {
    id: 1,
    name: 'NB RANGER - Virgin Force',
    artist: 'NieN',
    dlc: false
  }
];
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



// Defining RootQuery //

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    songs: {
      type: new GraphQLList(songType),
      description: 'DJ Max Respect Songs',
      resolve:async () => {
        let songs;
        const client = new pg.Client(dbConnection)
        await client.connect()
        .catch((err)=>console.log('Error connecting to DB', err))

        const query = 'Select * from songs'
        await client.query(query)
        .then((res)=>{songs = res.rows})
        .then(()=>client.end())
        .catch((err)=>console.log('Error with query', err))
        return songs
      }
    }
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
app.listen(PORT, () => {
  // getAllData()
  console.log('Server up');
});