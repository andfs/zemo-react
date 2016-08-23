'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';


export default class ParkoButton extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		let estilo = this.props.tamanho === "medio" ? styles.buttonMedio : this.props.tamanho === "pequeno" ? styles.buttonPequeno : this.props.tamanho === "menor" ? styles.buttonMenor : styles.button;
		return (
	        <View style={{alignItems: 'stretch', justifyContent: 'center'}}>
	        	<TouchableOpacity style={estilo} onPress={this.props.onPress} underlayColor='#99d9f4'>
			        <Text style={{color: 'white'}}>
			        	{this.props.texto}
			        </Text>
			    </TouchableOpacity>
	        </View>     
	    );
	}
}

const styles = StyleSheet.create({
	button: {
	    height: 36,
	    backgroundColor: '#48BBEC',
	    borderColor: '#48BBEC',
	    borderWidth: 1,
	    borderRadius: 8,
	    marginBottom: 10,
	    alignSelf: 'stretch',
	    alignItems: 'center',
	    justifyContent: 'center',
	    width: 200
	},
	buttonMedio: {
	    height: 36,
	    backgroundColor: '#48BBEC',
	    borderColor: '#48BBEC',
	    borderWidth: 1,
	    borderRadius: 8,
	    marginBottom: 10,
	    alignSelf: 'stretch',
	    alignItems: 'center',
	    justifyContent: 'center',
	    width: 300
	},
	buttonPequeno: {
	    height: 36,
	    backgroundColor: '#48BBEC',
	    borderColor: '#48BBEC',
	    borderWidth: 1,
	    borderRadius: 8,
	    marginBottom: 10,
	    alignSelf: 'stretch',
	    alignItems: 'center',
	    justifyContent: 'center',
	    width: 130
	},
	buttonMenor: {
	    height: 36,
	    backgroundColor: '#48BBEC',
	    borderColor: '#48BBEC',
	    borderWidth: 1,
	    borderRadius: 8,
	    marginBottom: 10,
	    alignSelf: 'stretch',
	    alignItems: 'center',
	    justifyContent: 'center',
	    width: 50
	}

});