import { createStackNavigator, createAppContainer } from "react-navigation";

import HomeScreen from "./screens/home/";
import UserSettingsiOS from "./screens/userSettingsiOS";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    UserSettings: UserSettingsiOS,
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;