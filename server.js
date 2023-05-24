require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { ApolloServer, gql } = require('apollo-server-express')



mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Base de données connecté'))

app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)
//grapheql
// GraphQL schema
const typeDefs = gql`
  type Subscriber {
    id: ID!
    name: String!
    subscribedToChannel: String!
    subscribeDate: String!
  }

  type Query {
    subscribers: [Subscriber!]!
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    subscribers: () => Subscriber.find(),
  },
};

// Create an Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });
// Mount the Apollo Server on the Express app
server.applyMiddleware({ app });
//serveur 
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log("Le serveur s'exécute sur le port", PORT)
})
}
startServer();