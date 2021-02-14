import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from '@apollo/client'
import logo from './logo.svg'
import './App.css'

const client = new ApolloClient({
  uri: 'https://graphql-weather-api.herokuapp.com',
  cache: new InMemoryCache(),
})

// this is your query -- it's convention to UPPERCASE the name
// apollo uses this name to look for the query in the cache
// you are providing the variable and type -- ($name: String!)
// the exclamation point make the name String variable, it is then passed to the getCityByName query, where name is REQUIRED
const GET_WEATHER = gql`
  query GetWeather($name: String!) {
    getCityByName(name: $name) {
      id
      name
      weather {
        wind {
          speed
        }
        clouds {
          humidity
          all
        }
        temperature {
          feelsLike
          actual
        }
      }
    }
  }
`

const WeatherInfo = (props) => {
  // loading is a boolean indicates if you have the data
  // error gives us err message
  // data - data from the query
  // and you're passing it the variable name with the information "New York"
  const { loading, error, data } = useQuery(GET_WEATHER, {
    variables: { name: 'New York' },
  })

  // const obj = useQuery(GET_WEATHER, {
  //   variables: { name: 'New York' },
  // })

  // console.log('obj', obj)
  // console.log('data', data)
  // console.log('loading', loading)
  // console.log('error', error)
  if (loading) return null
  const { weather, name } = data.getCityByName

  return (
    <div>
      <h1>Weather for {name}</h1>
      <p>Temperature: {weather.temperature.actual}</p>
      <p>Wind: {weather.wind.speed}</p>
      <p>Cloud cover: {weather.clouds.all}</p>
    </div>
  )
}

const SayHello = (props) => {
  return 'Hello'
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <WeatherInfo />
        <SayHello />
      </div>
    </ApolloProvider>
  )
}

export default App
