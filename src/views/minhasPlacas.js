'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Meteor, { createContainer, MeteorComplexListView } from 'react-native-meteor';
import NovaPlaca from './novaPlaca';
import ParkoButton from '../comp/parkoButton';
import ParkoTitulo from '../comp/parkoTitulo';
import { color } from '../estilos/geral';
import convertePlaca from '../functions/funcoesPlacas';

export default class MinhasPlacas extends Component {

	excluirPlaca(placa) {
		Meteor.collection('users').update({_id: Meteor.userId()}, {$pull: {placas: {placa: placa.placa}}});
	}

	capitalizeFirstLetter(valor) {
		return valor.charAt(0).toUpperCase() + valor.slice(1);
	}

	renderRow(item) {
		if(item) {
			let placa = convertePlaca(item.placa);
			let nomeCarro = this.capitalizeFirstLetter(item.carro);
			let cor = this.capitalizeFirstLetter(item.cor);
			return (
				<View style={styles.container}>
					<ParkoTitulo texto="Minhas Placas"/>
					<View style={styles.carContainer}>
						<View style={styles.infoContainer}>
							<Text style={styles.placa}>{placa}</Text>
							<Text style={styles.infoCarro}>{item.categoria === 'C' ? 'Carro' : item.categoria === 'M' ? 'Moto' : 'Carro grande'} | {nomeCarro} | {cor}</Text>
						</View>
						<View style={styles.infoContainerRight}>
							<View style={{flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end'}}>
								<TouchableOpacity>
									<Text style={styles.placa}>O</Text>
								</TouchableOpacity>

								<TouchableOpacity onPress={()=>this.excluirPlaca(item)}>
									<Text style={styles.placa}>X</Text>
								</TouchableOpacity>						
							</View>
						</View>
					</View>
				</View>
			);	
		}
		return null;
	}

	getElements() {
		return Meteor.user() ? Meteor.user().placas ? Meteor.user().placas : [] : [];
	}

	novaPlaca() {
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: NovaPlaca,
	          title: 'Nova Placa',
	        });
		}
		else {
			this.props.navigator.push({ name: 'novaPlaca'});
		}
	}

	render() {
		const { placas } = this.props;
		if(placas != undefined) {
			return(
				<View>
					<MeteorComplexListView
					  elements={this.getElements.bind(this)}
			          renderRow={this.renderRow.bind(this)}
			        />

			        <View style={styles.botaoView}>
			        	<ParkoButton onPress={this.novaPlaca.bind(this)} texto="Adicionar placa"/>
			        </View>
				</View>
			);	
		}
		else {
			return (
				<View style={styles.botaoView}>
					<ParkoButton onPress={this.novaPlaca.bind(this)} texto="Adicionar placa"/>
				</View>
			);
		}
		
	}
}


export default createContainer(params=>{
  Meteor.subscribe('usuariosPlacas');
  return {
    placas: Meteor.user() ? Meteor.user().placas : [],
  };
}, MinhasPlacas)

const styles = StyleSheet.create({
  container: {
  	borderBottomWidth: 1
  },
  botaoView: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	marginTop: 20
  },
  infoContainer: {
	flexDirection: 'column',
	flex: 1
  },
  infoContainerRight: {
  	flex: 1,
  	flexDirection: 'column',
  	alignItems: 'flex-end',
  	marginRight: 20
  },
  carContainer: {
  	flexDirection: 'row',
	paddingBottom: 10,
	left: 10
  },
  placa: {
  	fontWeight: 'bold',
  	fontSize: 28,
  	color: color.light2
  },
  infoCarro: {
  	marginTop: 5,
  	fontSize: 11,
  	marginLeft: 2,
  	color: color.dark2,
  	fontWeight: 'bold'
  },
  acoes: {
  	flexDirection: 'row',
  }
});