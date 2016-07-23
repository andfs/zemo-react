'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator
} from 'react-native';


export default class Loading extends Component {

	render() {
		return (
	        <ActivityIndicator
	          style={[styles.centering, styles.gray]}
	          color="blue" size="large"
	        />      
	    );
	}
}

const styles = StyleSheet.create({
	centering: {
	    alignItems: 'center',
	    justifyContent: 'center',
	    padding: 8,
	    flex:1
	},
	gray: {
	    backgroundColor: 'white',
	}
});