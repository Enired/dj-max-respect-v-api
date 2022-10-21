const express = require('express')
const app = express()
const expressGraphQL = require('express-graphql').graphqlHTTP
const PORT = process.env.PORT || 5000

// GraphQL Component Imports. //
const {
  GraphQLSchema,
  GraphQLObjectType,
  graphql,
  getDescription,
  GraphQLString
} = require('graphql')

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    song: {
      type: GraphQLString,
      description: 'A DJ Max Respect Song',
      resolve: () => 'Univus'
    }
  })

})

// const rootMutation = new GraphQLObjectType({
//   name: 'Mutation',
//   description: 'Root Mutation',
//   fields: ()=> ({

//   })
// })

const schema = new GraphQLSchema({
  query: rootQuery,
  // mutation : rootMutation,
  field: () => ({

  })
})

app.use('/graphql', expressGraphQL({
  graphiql: true,
  schema: schema,
}))
app.listen(5000, ()=>{
  console.log('Server up')
})