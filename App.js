import { createStackNavigator, createAppContainer } from "react-navigation";

import HomeScreen from "./screens/home/";
import UserSettings from "./screens/userSettings/";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    UserSettings: UserSettings,
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;