import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filter, handleFilterChange}) => {
  return (
      <div>find countries: <input value={filter} onChange={handleFilterChange} /> </div>
  )
}

const Countries = ({ countries, countryInfo}) => {

  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  if (countries.length <= 10 && countries.length > 1 ) {
  return (
    <div>
      {countries.map(country => (
        <div key={country.name.common}>{country.name.common}<button onClick={() => countryInfo(country.name.common)}> show </button>
        </div>
      ))}
    </div>
  )
  }
  if (countries.length == 1) {
    const country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital: {country.capital}</p>
        <p>area: {country.area}</p>
        <h2>Languages:</h2>
        <ul>
          {Object.values(country.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} />
      
      </div>
    )
  }
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')


  useEffect(() => {
    if (countries) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          setCountries(response.data)
          console.log(response.data)
        })
    }
  }, [])

  const countryFilter = countries.filter(c => 
    c.name.common.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    console.log(countryFilter)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  const countryInfo = (name) => {
    setFilter(name)
    console.log(setFilter)
  }

  return (
    <div>
      <form>
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
      </form>
      <Countries countries={countryFilter} countryInfo={countryInfo} /> 
    </div>
  )
}

export default App