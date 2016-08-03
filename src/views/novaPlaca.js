'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert
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
import MinhasPlacas from './minhasPlacas'

export default class NovaPlaca extends Component {

	onPress() {
		var value = this.refs.form.getValue();
		if(value) {
      let context = this;
			Meteor.call('novaPlaca', {placa: value.placa, carro: value.carro, cor: value.cor, categoria: value.categoria}, function (error, result) {
        if(error) {
          Alert.alert(
            "Ooops...",
            "Erro ao registrar a placa.",
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]
          );
        } else {
          if(Platform.OS === 'ios') {
            context.props.navigator.push({
                  component: MinhasPlacas,
                  title: 'Minhas Placas',
                });
          }
          else {
            context.props.navigator.push({ name: 'minhasPlacas'});
          }
        }
      });
		}
	}

	render() {
		return (
	      <View style={styles.container}>
	        <Form
	          ref="form"
	          type={Placa}
	        />
	        <TouchableOpacity style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
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