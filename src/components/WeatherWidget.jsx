import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "../assets/css/WeatherWidget.module.css";
import BeatLoader from "react-spinners/BeatLoader";

import axios from "axios";

const WeatherWidget = () => {
  const BASE_PATH_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
  // const BASE_PATH_GEO = "https://api.openweathermap.org/geo/1.0/direct";
  const API_KEY = "6c96feab2d79020ffa8dd898a968beb8";
  const ICON_URL = "https://openweathermap.org/img/w/";

  const [city, setCity] = useState("");
  const [showCityError, setShowSetCityError] = useState(false);
  const [cityErrorMessage, setCityErrorMessage] = useState("");

  const [result, setResult] = useState(null);

  const [showLoader, setShowLoader] = useState(false);

  const weatherFormSubmitHandler = (event) => {
    event.preventDefault();

    setShowLoader(true);

    if (validateForm()) getCurrentWeatherByCity(city);
    else setShowLoader(false);
  };

  const validateForm = () => {
    let cityError = false,
      cityErrorMessage = "";

    let cityValue = city.trim();

    const cityNameRegex = /^([a-zA-Z][a-zA-Z ]{0,49})$/;

    if (cityValue === "") {
      cityError = true;
      cityErrorMessage = "City name field is required.";

      setResult(null);
    } else if (!cityNameRegex.test(cityValue)) {
      cityError = true;
      cityErrorMessage = "Invalid city format. Please enter a valid city name.";
    }

    setShowSetCityError(cityError);
    setCityErrorMessage(cityErrorMessage);

    if (cityError) return false;

    return true;
  };
  //   let URL = `${BASE_PATH_GEO}?q=${city}&limit=5&appid=${API_KEY}`;
  //   axios
  //     .get(URL)
  //     .then((response) => {
  //       console.log(response);
  //       // console.log(response.data[0].lat, response.data[0].lon);
  //       getCurrentWeatherByLatLong(response.data[0].lat, response.data[0].lon);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setShowLoader(false);
  //       setShowSetCityError(true);
  //       setCityErrorMessage(error.message);
  //     });
  // };

  const getCurrentWeatherByCity = (city) => {
    let URL = `${BASE_PATH_WEATHER}?q=${city}&units=metric&appid=${API_KEY}`

    axios.get(URL).then((response) => {
      let responseData = response.data,
        data = {
          city,
          dateTime: getFormattedDateTime(),

          cityName: responseData.name,
          countryShortName: responseData.sys.country,

          temperature: responseData.main.temp,
          temperatureMax: responseData.main.temp_max,
          temperatureMin: responseData.main.temp_min,
          feelsLike: responseData.main.feels_like,
          humidity: responseData.main.humidity,
          windSpeed: responseData.wind.speed,

          currentWeatherMessage: responseData.weather[0].main,
          currentWeatherDescription: responseData.weather[0].description,
          currentWeatherIcon: `${ICON_URL}${responseData.weather[0].icon}.png`,
        };

      setResult(data);
      setShowLoader(false);
    }).catch((error) => {
      setShowLoader(false);
      setShowSetCityError(true);
      setCityErrorMessage(error.message);
    });
  };

  const getFormattedDateTime = () => {
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedDate;
  };

  return (
    <>
      <div className={styles.weather_form_body}>
        {/* <AutoCompleteCity /> */}
        <h1 className={styles.weather_heading}>Check Weather</h1>
        <form onSubmit={weatherFormSubmitHandler}>
          <div
            className={`${styles.input_div} ${showCityError ? styles.mark_error : ""
              }`} style={{ textAlign: 'center', margin: "10px auto" }}
          >
            <input
              type="text"
              name="city"
              placeholder="Enter city name"
              className={styles.text_input}
              autoFocus
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {showCityError && (
            <div style={{ marginTop: "-5px" }}>
              <p className={styles.error_message}>{cityErrorMessage}</p>
            </div>
          )}

          {!showLoader && (
            <div>
              <input
                type="submit"
                value="CHECK WEATHER"
                style={{ textAlign: 'center', margin: "10px auto" }}
                className={styles.get_weather_btn}
              />
            </div>
          )}

          {showLoader && (
            <button disabled className={styles.loader_btn} style={{ textAlign: 'center', width: "250px", margin: "10px auto" }}>
              <BeatLoader color="#fff" />
            </button>
          )}
        </form>


      </div>
      {result && (
        <div className={styles.result_div}>
          <h2 style={{ color: "black" }}>
            Weather in{" "} <br />
              <span style={{ color: "white" }}>
                {result.cityName}, {result.countryShortName}
              </span>
          </h2>
          <div style={{ color: "#888" }}>
            <p style={{ color: "white", margin: "5px" }}>{result.dateTime}</p>
            <div
              style={{
                color: "#161515",

                display: "inline-flex"
              }}
            >
              <div style={{ margin: "10px auto" }}>
                <img
                  style={{ height: "75px", width: "75px" }}
                  src={result.currentWeatherIcon}
                  alt={result.currentWeatherMessage}
                /></div>{" "}
              <div style={{
                fontSize: "64px",
                fontWeight: "",
              }}>
                {result.temperature
                  ? `${Math.floor(result.temperature)}°C`
                  : "NA"}
              </div>
            </div>

            <div style={{ margin: "-30px" }}>
              <p style={{ textTransform: "capitalize", fontWeight: "bold", color: "rgb(22, 21, 21)" }}>
                {result.currentWeatherMessage
                  ? result.currentWeatherDescription
                  : "NA"}
              </p>
              <p>Feels Like: {result.feelsLike ? `${Math.floor(result.feelsLike)}°C` : `NA`}</p>
              <p style={{ margin: "15px" }}>
                {result.temperatureMax
                  ? `High ${Math.floor(result.temperatureMax)}°C`
                  : "NA"}{" "}
                |{" "}
                {result.temperatureMin
                  ? `Low ${Math.floor(result.temperatureMin)}°C`
                  : "NA"}
              </p>
              <p style={{ margin: "15px" }}>
                {result.windSpeed
                  ? `Wind Speed: ${result.windSpeed}km/h`
                  : "NA"}
              </p>
            </div>

          </div>
        </div >
      )}
    </>
  );
};

export default WeatherWidget;
