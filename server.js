const express = require('express')
const app = express()
const expressGraphQL = require('express-graphql').graphqlHTTP
const PORT = process.env.PORT || 5000

// GraphQL Component Imports. //
const {
  GraphQLSchema,
  GraphQLObjectType,
  graphql
} = require('graphql')

const schema = new GraphQLSchema({
  
})

app.use('/graphql', expressGraphQL({
  graphiql: true,
  schema: schema,
}))
app.listen(5000, ()=>{
  console.log('Server up')
})