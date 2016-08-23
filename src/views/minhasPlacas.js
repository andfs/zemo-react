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
import { stylesGeral, color } from '../estilos/geral';

export default class MinhasPlacas extends Component {

	excluirPlaca(placa) {
		Meteor.collection('users').update({_id: Meteor.userId()}, {$pull: {placas: {placa: placa.placa}}});
	}

	renderRow(item) {
		if(item) {
			return (
				<View style={styles.container}>
					<View style={stylesGeral.titleContainer}>
						<Text style={stylesGeral.title}>Minhas Placas</Text>
					</View>
					<View style={styles.carContainer}>
						<View style={styles.infoContainer}>
							<Text style={styles.placa}>{item.placa}</Text>
							<Text style={styles.infoCarro}>{item.carro} | {item.categoria === 'C' ? 'carro' : item.categoria === 'M' ? 'moto' : 'carro grande'} | {item.cor}</Text>
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
				<View style={{flex: 1}}>
					<MeteorComplexListView
					  elements={this.getElements.bind(this)}
			          renderRow={this.renderRow.bind(this)}
			        />

			        <ParkoButton onPress={this.novaPlaca.bind(this)} texto="Adicionar placa"/>
				</View>
			);	
		}
		else {
			return (
				<ParkoButton onPress={this.novaPlaca.bind(this)} texto="Adicionar placa"/>
			);
		}
		
	}
}


export default createContainer(params=>{
  Meteor.subscribe('usuariosPlacas');
  return {
    placas: Meteor.user().placas,
  };
}, MinhasPlacas)

const styles = StyleSheet.create({
  container: {
  	borderBottomWidth: 1
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
  	fontSize: 28
  },
  infoCarro: {
  	marginTop: 10,
  	fontSize: 10
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
  },
  acoes: {
  	flexDirection: 'row',
  }
});