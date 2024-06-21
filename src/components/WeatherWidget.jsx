import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "../assets/css/WeatherWidget.module.css";
import BeatLoader from "react-spinners/BeatLoader";

import axios from "axios";

const WeatherWidget = () => {
  const BASE_PATH_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
  const BASE_PATH_GEO = "https://api.openweathermap.org/geo/1.0/direct";
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

    if (validateForm()) getLatLongFromCity(city);
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
      cityErrorMessage = "Invalid city name.";
    }

    setShowSetCityError(cityError);
    setCityErrorMessage(cityErrorMessage);

    if (cityError) return false;

    return true;
  };

  const getLatLongFromCity = (city) => {
    let URL = `${BASE_PATH_GEO}?q=${city}&limit=1&appid=${API_KEY}`;
    axios
      .get(URL)
      .then((response) => {
        console.log(response.data[0].lat, response.data[0].lon);
        getCurrentWeatherByLatLong(response.data[0].lat, response.data[0].lon);
      })
      .catch((error) => {
        setShowLoader(false);
        setShowSetCityError(true);
        setCityErrorMessage("Inavlid city name.");
      });
  };

  const getCurrentWeatherByLatLong = (lat, lon) => {
    let URL = `${BASE_PATH_WEATHER}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
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

      console.log(response);

      setResult(data);
      setShowLoader(false);
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
        <h1 className={styles.weather_heading}>Check Weather</h1>
        <form onSubmit={weatherFormSubmitHandler}>
          <div
            className={`${styles.input_div} ${showCityError ? styles.mark_error : ""
              }`}
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
            <div>
              <p className={styles.error_message}>{cityErrorMessage}</p>
            </div>
          )}

          {!showLoader && (
            <input
              type="submit"
              value="CHECK WEATHER"
              className={styles.get_weather_btn}
            />
          )}

          {showLoader && (
            <button disabled className={styles.loader_btn}>
              <BeatLoader color="#fff" />
            </button>
          )}
        </form>

        {result && (
          <div style={{ marginTop: "100px" }}>
            <h2 style={{ color: "black" }}>
              Weather in{" "}
              <span style={{ color: "white" }}>
                {result.cityName}, {result.countryShortName}
              </span>
            </h2>
            <div>
              <p style={{ color: "white", margin: "5px" }}>{result.dateTime}</p>
              <p
                style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}
              >
                {result.temperature
                  ? `${Math.floor(result.temperature)}°C`
                  : "NA"}
              </p>
              <p style={{ margin: "5px" }}>
                {result.temperatureMax
                  ? `Max: ${Math.floor(result.temperatureMax)}°C`
                  : "NA"}{" "}
                |{" "}
                {result.temperatureMin
                  ? `Min: ${Math.floor(result.temperatureMin)}°C`
                  : "NA"}
              </p>

              <div
                style={{
                  margin: "auto",
                  display: "inline-flex",
                  textAlign: "center",
                }}
              >
                <img
                  style={{ height: "50px", width: "50px" }}
                  src={result.currentWeatherIcon}
                  alt={result.currentWeatherMessage}
                />{" "}
                <p style={{ textTransform: "capitalize" }}>
                  {result.currentWeatherMessage
                    ? result.currentWeatherDescription
                    : "NA"}
                </p>
              </div>
              <p style={{ margin: "5px" }}>
                {result.windSpeed
                  ? `Wind Speed: ${result.windSpeed}km/h`
                  : "NA"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherWidget;
