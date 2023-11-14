import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `

 type CityAddress {
    city: String
    state: String
    country_code: String
 }

  type City {
    name: String
    country: String
    address: CityAddress
  }

  type Query {
    city(cityName: String!): City
  }
`

const fetchCity = async url => {
  const result = await fetch(url)
  const response = await result.json()
  return response[0]
}

const resolvers = {
    Query: {
        city: async (_, args) => {
          const url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${args.cityName}&format=jsonv2&limit=1`
          const result = await fetchCity(url)
          console.log('result', result)
          return {name: result.name, country: result.address.country, address: result.address}
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);