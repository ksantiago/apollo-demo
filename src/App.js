import logo from "./logo.svg";
import "./App.css";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql-weather-api.herokuapp.com",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          localHello: {
            read(_, { variables }) {
              const { subject } = variables;
              return `Hello ${subject ? subject : "World"}`
            },
          },
        },
      },
    },
  }),
});

const LOCAL_HELLO = gql`
  query localHello($subject: String) {
    localHello(subject: $subject) @client
  }
`;

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
`;

const WeatherInfo = (props) => {
  const { loading, error, data } = useQuery(GET_WEATHER, {
    variables: { name: "New York" },
  });

  if (loading) {
    return <div>Loading!!!</div>;
  }

  const { weather, name } = data.getCityByName;

  return (
    <div>
      <h1>Weather for {name}</h1>
      <p>Temperature: {weather.temperature.actual}</p>
      <p>Wind: {weather.wind.speed}</p>
      <p>Cloud cover: {weather.clouds.all}</p>
    </div>
  );
};

const SayHello = (props) => {
  const { loading, error, data } = useQuery(LOCAL_HELLO, {
    variables: { subject: "New York" },
  });

  if (loading) return null;

  return <div style={{ backgroundColor: "red"}}>{data.localHello}</div>;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <WeatherInfo />
        <SayHello />
      </div>
    </ApolloProvider>
  );
}

export default App;
