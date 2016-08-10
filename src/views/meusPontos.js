import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import Loading from '../comp/loading';
import Moment from 'moment';
import convertePlaca from '../functions/funcoesPlacas'

export default class MeusPontos extends Component {

	onPress() {

	}

	render() {
		const { ready, pontos } = this.props;

		if(!ready) {
			return(
				<Loading/>
			);
		}
		else {
			return(
				<View style={styles.container}>
					<View style={{alignItems: 'center', justifyContent: 'center'}}>
						<Text style={styles.pontos}>{pontos}</Text>
						<Text style={styles.descricao}>Troque seus pontos por horas grátis em estacionamentos.</Text>
					</View>
					<View style={{alignItems: 'stretch', justifyContent: 'center'}}>
						<TouchableOpacity style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
					        <Text style={styles.buttonText}>Trocar pontos</Text>
					    </TouchableOpacity>
					</View>
				</View>
			);
		}
	}
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('usuariosPlacas');

  return {
    ready: handle.ready(),
    pontos: Meteor.user().pontos
  };
}, MeusPontos)

const styles = StyleSheet.create({
  container: {
  	alignItems: 'center',
  	justifyContent: 'center'
  },
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
    flex: 1
  }
});
