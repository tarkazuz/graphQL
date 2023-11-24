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

  type CityError {
    error: String
  }

  union CityOrError = City | CityError

  type Query {
    city(cityName: String!): CityOrError
  }
`

const resolvers = {
    Query: {
        city: async (_, args) => {
          const url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${args.cityName}&format=jsonv2&limit=1`
          return fetch(url)
          .then(result=> result.json())
          .then(res =>{
            const result = res[0]
            return  {
              name: result.name, 
              country: result.address.country, 
              address: result.address,
              lat: result.lat,
              lon: result.lon
            }
          }).catch((e)=>{
            console.log(e)
            return {error: 'smth went wrong'}
          })
        }
    },
    City: {
      temperature: async parent => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${parent.lat}&longitude=${parent.lon}&current=temperature_2m`
        const resp = await fetch(url).then(response => response.json())
        console.log(resp)
        return {temperature: resp.current.temperature_2m, unit: resp.current_units.temperature_2m}
      }
    },
    CityOrError: {
      __resolveType(smth){
        console.log(smth)
        return smth?.error ? 'CityError' : 'City'
      }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);