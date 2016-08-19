import React, { Component } from 'react';
import { Image, StatusBar, View, StyleSheet } from 'react-native';

const image = require('../../resources/img/background.png');

export default class Background extends Component {

	render() {
		return (
			<View style={styles.container}>
		        <StatusBar translucent={true} backgroundColor="transparent"/>
		        <Image source={image} style={styles.backgroundImage}>
		            <View>
		                {this.props.children}
		            </View>
		        </Image>
		    </View>
		);
	}
}

const styles = StyleSheet.create({
	backgroundImage: {
        flex: 1,
        resizeMode: Image.resizeMode.stretch,
        width: null,
        height: null,
  	},
  	container: {
	    flex: 1,
	},
  	innerContainer: {
	    justifyContent: 'flex-start',
	    alignItems: 'center',
	    padding: 10,
	    paddingTop: 180,
	    backgroundColor: 'transparent'
	  }
});