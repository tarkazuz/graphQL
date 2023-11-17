import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `

 type CityAddress {
    city: String
    state: String
    country_code: String
 }

 type Temperature {
  temperature: Float
  unit: String
 }

  type City {
    name: String
    country: String
    temperature: Temperature
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
          return {
            name: result.name, 
            country: result.address.country, 
            address: result.address,
            lat: result.lat,
            lon: result.lon
          }
        }
    },
    City: {
      temperature: async parent => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${parent.lat}&longitude=${parent.lon}&current=temperature_2m`
        const resp = await fetch(url).then(response => response.json())
        console.log(resp)
        return {temperature: resp.current.temperature_2m, unit: resp.current_units.temperature_2m}
      }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);