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
import ParkoTitulo from '../comp/parkoTitulo';
import { stylesGeral, color } from '../estilos/geral';

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
					<ParkoTitulo texto="Meus Pontos"/>
					<View style={{alignItems: 'center', justifyContent: 'center', marginTop: 60}}>
						<View style={{flexDirection: 'row', marginBottom: 15}}>
							<Text style={styles.pontos}>{pontos}</Text>
							<View style={{justifyContent: 'flex-end'}}>
								<Text style={styles.pontosDescricao}>pts</Text>
							</View>
						</View>
						<Text style={stylesGeral.topico}>Troque seus pontos por horas em estacionamentos.</Text>
					</View>
					<View style={{alignItems: 'stretch', justifyContent: 'center', marginTop: 10}}>
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
  },
  pontos: {
  	color: color.light1,
  	fontSize: 42,
  	fontWeight: 'bold'
  },
  pontosDescricao: {
  	color: color.light1,
  	fontSize: 11,
  	marginLeft: 5,
  	paddingBottom: 9
  }
});
