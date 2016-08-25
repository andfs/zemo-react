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
  nome_veiculo: t.String,
  cor: t.String,  
  categoria: Categoria
});

import Meteor, { createContainer, MeteorComplexListView } from 'react-native-meteor';
import MinhasPlacas from './minhasPlacas';
import ParkoButton from '../comp/parkoButton';
import ParkoTitulo from '../comp/parkoTitulo';
import { color } from '../estilos/geral';

t.form.Form.stylesheet.textbox.normal.color = color.light2;

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
        <ParkoTitulo texto="Nova Placa"/>
          <View style={{paddingLeft: 10}}>
            <Form
              ref="form"
              type={Placa}
            />
          </View>
          <View style={styles.button}>
            <ParkoButton onPress={this.onPress.bind(this)} texto="Salvar" tamanho="medio"/>
            <ParkoButton onPress={()=>this.props.navigator.pop()} texto="Cancelar" tamanho="medio"/>
          </View>
	      </View>
	    );
	}
}

const styles = StyleSheet.create({
 container: {
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});