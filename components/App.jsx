import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";

const API_KEY = "91c6798f86f7493420630576864cac9a"; 
const API_COUNTRY_URL = "https://countryflagsapi.com/png/";
const API_UNSPLASH = "https://source.unsplash.com/1600x900/?";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Lista de cidades sugeridas
  const suggestedCities = [
    "Rio do Sul",
    "Joinville",
    "Laurentino",
    "Trombudo Central",
    "Maceió",
    "Islam",
  ];

  const fetchWeatherData = async (cityName) => {
    if (!API_KEY) {
      Alert.alert("Erro", "erro na chave de api");
      return;
    }

    setLoading(true);
    setError(false);
    setWeatherData(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}&lang=pt_br`
      );
      setWeatherData(response.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Clima da cidade:</Text>

      {/* Input e Botão de Busca */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da cidade"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={() => fetchWeatherData(city)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => fetchWeatherData(city)}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Exibição do Clima */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>Cidade não encontrada! ❌</Text>}

      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>
            📍 {weatherData.name}{" "}
            <Image
              source={{ uri: API_COUNTRY_URL + weatherData.sys.country }}
              style={styles.countryFlag}
            />
          </Text>
          <Text style={styles.temperature}>
            🌡 {parseInt(weatherData.main.temp)}°C
          </Text>
          <Text style={styles.description}>
            {weatherData.weather[0].description}
          </Text>
          <Image
            source={{
              uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
            }}
            style={styles.weatherIcon}
          />
          <Text style={styles.details}>💧 Umidade: {weatherData.main.humidity}%</Text>
          <Text style={styles.details}>💨 Vento: {weatherData.wind.speed} km/h</Text>
        </View>
      )}

      {/* Sugestões de cidades */}
      <View style={styles.suggestionsContainer}>
        {suggestedCities.map((cityName) => (
          <TouchableOpacity
            key={cityName}
            style={styles.suggestionButton}
            onPress={() => fetchWeatherData(cityName)}
          >
            <Text style={styles.suggestionButtonText}>{cityName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  weatherContainer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    elevation: 3,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  countryFlag: {
    width: 30,
    height: 20,
    marginLeft: 10,
  },
  temperature: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 10,
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginVertical: 10,
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  suggestionButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  suggestionButtonText: {
    color: "#fff",
  },
});