'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

var t = require('tcomb-form-native');
var Form = t.form.Form;
var Categoria = t.enums({
  C: 'Carro',
  M: 'Moto',
  CA: 'Carro grande'
});
var Placa = t.struct({
  placa: t.String,
  carro: t.String,
  cor: t.String,  
  categoria: Categoria
});

import Meteor, { createContainer, MeteorComplexListView } from 'react-native-meteor';

export default class NovaPlaca extends Component {

	onPress() {

	}

	render() {
		return (
	      <View style={styles.container}>
	        <Form
	          ref="form"
	          type={Placa}
	        />
	        <TouchableOpacity style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
	          <Text style={styles.buttonText}>Salvar</Text>
	        </TouchableOpacity>
	      </View>
	    );
	}
}

const styles = StyleSheet.create({
 container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});