'use strict'

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import { stylesGeral } from '../estilos/geral';


export default class ParkoTitulo extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		return (
	        <View style={stylesGeral.titleContainer}>
				<Text style={stylesGeral.title}>
					{this.props.texto}
				</Text>
			</View>
	    );
	}
}