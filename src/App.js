
import React ,{useState, useEffect} from 'react'
import { FormControl, Select, MenuItem, Card, CardContent } from '@mui/material'
import InfoCard from './InfoCard'
import Map from './Map'
import Table from "./Table"
import LineGraph from './LineGraph'
import {sortData, prettyPrintStat} from './utils.js'
import './App.css';
import "leaflet/dist/leaflet.css"
function App() {

  // https://disease.sh/v3/covid-19/countries

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4796})
  const[mapZoom, setMapZoom] = useState(3)
  const[mapCountries, setMapCountries] = useState([])

  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
    const getCountryInfo = async () =>{
      await fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
          setCountryInfo(data)
      });
    }
    getCountryInfo();
  }, []);


  useEffect(() => {

    const getCountryData = async () =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
          ))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
      });
    }
    getCountryData();

  }, []);

   const handleCountryChange = async (e) =>{
     const country = e.target.value;
     const url = country === 'worldwide' ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${country}`;

   await fetch(url)
   .then(response => response.json())
   .then(data => {
    setCountryInfo(data);
    setCountry(country)

    setMapCenter([data.countryInfo.lat, data.countryInfo.long])
    setMapZoom(5)

   })
  }
 
  return (
    <div className="App">

      <div className="app__left">
      <div className="app__header">
            <h1>Covid-19 Tracker</h1>
            <FormControl className='app__dropdown'>
            <Select variant='outlined' value={country} onChange={handleCountryChange} >
            <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map(country => (<MenuItem value={country.value}>{country.name}</MenuItem>))}
              </Select>
            </FormControl>
            </div>

            <div className="app__stats">
            <InfoCard title="CoronaVirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases}/>
            <InfoCard title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered}/>
            <InfoCard title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}/>
            </div>

            <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>

        <Card className="app__right">
         <CardContent>
           <h3>Live cases by country</h3>
            <Table countries={tableData} />
           <h3>Worldwide new cases</h3>
           <LineGraph />
           </CardContent>
        </Card>
     
    
     
    </div>
  );
}

export default App;
