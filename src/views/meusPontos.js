import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import Loading from '../comp/loading';
import Moment from 'moment';
import convertePlaca from '../functions/funcoesPlacas';
import ParkoButton from '../comp/parkoButton';

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
						<Text style={styles.descricao}>Troque seus ponts por horas grátis em estacionamentos.</Text>
					</View>
					<View style={{alignItems: 'stretch', justifyContent: 'center'}}>
						<ParkoButton onPress={this.onPress.bind(this)} texto="Trocar pontos"/>
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
  }
});
