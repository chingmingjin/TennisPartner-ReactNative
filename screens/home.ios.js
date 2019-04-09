import React, { Component } from 'react';

import HomeContainer from "./homeContainer/";
import { withNavigation } from 'react-navigation';


class HomeScreen extends Component {
    render() {
      return (
          <HomeContainer />
      );
    }
  }

  export default withNavigation(HomeScreen);