import React, { Component } from "react";
import {
  Content,
  Container,
  View, 
  Text
} from "native-base";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <View style={{backgroundColor: 'blue'}} />
          <Text>Ivan Grubišić</Text>

        </Content>
      </Container>
    );
  }
}