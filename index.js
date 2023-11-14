import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `
  type City {
    name: String
    country: String
  }

  type Query {
    city(cityName: String!): City
  }
`

const resolvers = {
    Query: {
        city: (_, args) => city[args.cityName]
    }
}

const city = {
    Warsaw: {name: 'Warsaw'},
    Berlin: {name: 'Berlin'}
}

const server = new ApolloServer({typeDefs, resolvers})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);