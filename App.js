import { createStackNavigator, createAppContainer } from "react-navigation";

import HomeScreen from "./screens/home/";


const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;