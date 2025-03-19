import "../../app/global.css";
import tw from "twrnc";
import React, { useCallback, useEffect, useState } from "react";
import { theme } from "../../theme/index";
import {
  Image,
  StatusBar,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { debounce } from "lodash";
import {fetchLocationTemp, fetchPrevisaoTemp} from '../../api/api'
import weatherImages from '../../constants/index'


export default function HomeScreen() {

  const handleLocation = (loc)=>{
    console.log('location' , loc)
    setLocations([])
    toggleSearch(false)
    fetchPrevisaoTemp({
        cityName: loc.name,
        days: '7'
    }).then(data=>{
        console.log(data)
        setWeather(data)
    })
  }
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});


  const handleSearch = value => {
    if(value.length> 2){
        fetchLocationTemp({cityName:value}).then(data=>{
            setLocations(data)
          })
    }
    // console.log(value)
   
  }
  const handleTextDebounce = useCallback(debounce(handleSearch , 120),[])

  const {current, location} = weather;


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        resizeMode="cover"
        blurRadius={1}
        source={require("../../assets/images/teste4.png")}
        style={styles.backgroundImage}
      />
      <SafeAreaView style={tw`flex flex-1`}>
        <View style={tw`relative mx-4 z-50 mt-6`}>
          <View
            style={[
              tw`flex-row justify-end items-center rounded-full`,
              {
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              },
            ]}
          >
            {showSearch ? (
              <TextInput
              onChangeText={handleTextDebounce}
                placeholder="Search your City or State"
                placeholderTextColor={"lightgray"}
                style={tw`pl-6 pb-1 h-10 flex-1 text-base text-white font-medium`}
              />
            ) : null
            }

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={[
                tw`rounded-full p-3 m-1`,
                { backgroundColor: theme.bgWhite(0.3) },
              ]}
            >
              <Ionicons name="search" color="white" size={25} />
            </TouchableOpacity>
          </View>
          {
            locations.length>0 &&  showSearch? (
                <View style={tw`absolute w-full bg-gray-400 top-16 rounded-3xl`}>{
                    locations.map((loc, index)=>{
                        // let showBorder = index !== locations.length
                        // let borderClass = showBorder? 'border-b-2 border-b-gray-300' : ''
                        return(
                            <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            style={tw`flex-row items-center border-0 p-3 px-4 mb-1`}>
                                <Ionicons name="location-outline" size={20} color="black" style={tw`mr-2`}/>
                                <Text style={tw`text-black text-base font-semibold`}>
                                    {loc?.name}, {loc?.country}
                                </Text>
                            </TouchableOpacity>
                        )   
                    })
                } </View>
            ):null
          }
        </View>

        <View style={tw`mx-4 flex justify-around  flex-1  mb-2`}>
          <Text style={tw`text-white text-center text-3xl font-bold`}>Rio do Sul,
          <Text style={tw`text-lg text-white font-semibold text-2xl`}>  SC</Text>
          </Text>
          <View style={tw`space-y-3`}>
            <Text style={tw` text-center text-white text-7xl font-bold`}>
            {/* {current?.temp_c} */}
            28&#176;
            </Text>
            <Text style={tw` text-center text-white text-xl tracking-widest `}>
            {current?.condition?.text}
            Parcialmente nublado            </Text>
          </View>
          <View style={tw`flex-row justify-center `}>
          <Image source={require("../../assets/images/partlycloudy.png")} style={tw`w-48 h-48`} />
          {/* <Image source={weatherImages[current?.condition?.text]} style={tw`w-48 h-48`}/> */}
          {/* <Image source={{uri: 'https:'+current?.condition?.icon}} /> */}
          </View>
          
          <View style={tw`flex-row justify-between mx-4`}>
            <View style={tw`space-x-2 flex-row items-center`}>
                <Image source={require("../../assets/icons/wind.png")} style={tw`w-6 h-6`} />  
                <Text style={tw`text-white text-base font-semibold ml-2`}>
                    {current?.wind_kph}22km
                </Text>
            </View>
            <View style={tw`space-x-2 flex-row items-center`}>
                <Image source={require("../../assets/icons/drop.png")} style={tw`w-6 h-6`} />  
                <Text style={tw`text-white text-base font-semibold ml-2`}>
                    {  current?.humidity}23%
                </Text>
            </View>
            <View style={tw`space-x-2 flex-row items-center`}>
                <Image source={require("../../assets/icons/sun.png")} style={tw`w-6 h-6`} />  
                <Text style={tw`text-white text-base font-semibold ml-2`}>
                    6:05 AM
                </Text>
            </View>
          </View>
        </View>

        {/* para os próximos dias  */}
        <View style={tw`space-y-3 mb-2`}>
          <View style={tw`flex-row items-center mx-4 space-x-2`}>
          <Ionicons name="calendar-outline" size={22} color="white" style={tw`mr-2 mb-4`}/>
          <Text style={tw`text-white text-base mb-4`}>
            Previsão para o dia
          </Text>
          </View>
          <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 15}} showsHorizontalScrollIndicator={false} >
            <View style={[tw`flex justify-center items-center w-26 rounded-3xl py-3 space-y-1 mr-4 mb-2`, {backgroundColor: theme.bgWhite(0.15)} ]}>
            <Image source={require("../../assets/images/heavyrain.png")} style={tw`w-16 h-16 rounded-3xl`} />
            <Text style={tw`text-white text-base font-medium mt-1 text-center`}>
                Segunda
                Feira
            </Text>
            <Text style={tw`text-white text-base font-semibold text-center ml-2`}>
            26&#176;
            </Text>
            </View>
            <View style={[tw`flex justify-center items-center w-26 rounded-3xl py-3 space-y-1 mr-4 mb-2 text-center`, {backgroundColor: theme.bgWhite(0.15)} ]}>
            <Image source={require("../../assets/images/heavyrain.png")} style={tw`w-16 h-16 rounded-3xl`} />
            <Text style={tw`text-white text-base font-medium mt-1 text-center`}>
                Terça {"\n"}
                Feira
            </Text>
            <Text style={tw`text-white text-base font-semibold ml-2`}>
            26&#176;
            </Text>
            </View>
            <View style={[tw`flex justify-center items-center w-26 rounded-3xl py-3 space-y-1 mr-4 mb-2`, {backgroundColor: theme.bgWhite(0.15)} ]}>
            <Image source={require("../../assets/images/heavyrain.png")} style={tw`w-16 h-16 rounded-3xl`} />
            <Text style={tw`text-white text-base font-medium mt-1 text-center`}>
                Quarta{"\n"}feira
            </Text>
            <Text style={tw`text-white text-base font-semibold ml-2`}>
            26&#176;
            </Text>
            </View>
            <View style={[tw`flex justify-center items-center w-26 rounded-3xl py-3 space-y-1 mr-4 mb-2`, {backgroundColor: theme.bgWhite(0.15)} ]}>
            <Image source={require("../../assets/images/heavyrain.png")} style={tw`w-16 h-16 rounded-3xl`} />
            <Text style={tw`text-white text-base font-medium mt-1 text-center`}>
                Quinta{"\n"}feira
            </Text>
            <Text style={tw`text-white text-base font-semibold ml-2`}>
            26&#176;
            </Text>
            </View>
            <View style={[tw`flex justify-center items-center w-26 rounded-3xl py-3 space-y-1 mr-4 mb-2`, {backgroundColor: theme.bgWhite(0.15)} ]}>
            <Image source={require("../../assets/images/heavyrain.png")} style={tw`w-16 h-16 rounded-3xl`} />
            <Text style={tw`text-white text-base font-medium mt-1 text-center`}>
                Sexta{"\n"}feira
            </Text>
            <Text style={tw`text-white text-base font-semibold ml-2`}>
            26&#176;
            </Text>
            </View>
            
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});