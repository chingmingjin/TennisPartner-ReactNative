import React, { Component } from 'react';
import * as Progress from 'react-native-progress';

class Spinner extends Component {
    render() {
        return (
            <Progress.Circle 
                style={{ alignSelf: 'center' }} color="#ffa737" size={45} borderWidth={3} indeterminate={true} 
                />
        )
    }
}

export { Spinner };
