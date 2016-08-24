'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Navigator,
  Platform,
  AsyncStorage,
  NavigatorIOS
} from 'react-native';

import estiloMenu from './estilos/estiloMenu';
import Meteor from 'react-native-meteor';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;

import MinhasPlacas from './minhasPlacas';
import ReservarVagas from './reservarVaga';
import MeusPontos from './meusPontos';
import CartoesCredito from './cartoesCredito';
import Pagar from './pagar';

export default class MenuView extends Component {

	logout() {
		this.props.pai.setState({isLoading: true});
		let context = this.props.pai;
		AsyncStorage.getItem('loginFacebookParko', function(error, result) {
			if(!error) {	
				if(result === 'true') {
					LoginManager.logOut();
					AsyncStorage.removeItem('parkoAccess_Token', function() {
						context.setState({isLoading: false, isLogin: true});
					});
				}
				else {
					Meteor.logout(function (error) {
						if(!error) {
							AsyncStorage.removeItem('parkoAccess_Token', function() {
								context.setState({isLoading: false, isLogin: true});
							});
						}
						else {
							alert(error);
						}
					});
				}
			}
			else {
				console.log('error.message');
			}
		});
	}

	minhasPlacas() {
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: MinhasPlacas,
	          title: 'Minhas Placas',
	        });
		}
		else {
			this.props.navigator.push({ name: 'minhasPlacas'});
		}
	}

	meusPontos() {
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: MeusPontos,
	          title: 'Meus Pontos',
	        });
		}
		else {
			this.props.navigator.push({ name: 'meusPontos'});
		}	
	}

	reservarVagas() {
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: ReservarVagas,
	          title: 'Reservar Vaga',
	        });
		}
		else {
			this.props.navigator.push({ name: 'reservarVagas'});
		}
	}

	pagar() {
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: Pagar,
	          title: 'Pagar',
	        });
		}
		else {
			this.props.navigator.push({ name: 'pagar'});
		}
	}

	pagamento() {
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: CartoesCredito,
	          title: 'Pagamento',
	        });
		}
		else {
			this.props.navigator.push({ name: 'cartoesCredito'});
		}
	}

	render() {
		return(
			<View style={estiloMenu.drawer}>
				<TouchableOpacity style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Home</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.pagamento.bind(this)} style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Meu Cartão de Crédito</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.reservarVagas.bind(this)} style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Reservar Vaga</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.pagar.bind(this)} style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Pagar</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.meusPontos.bind(this)} style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Meus Pontos</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Meus Vouchers</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.minhasPlacas.bind(this)} style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Minhas Placas</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.logout.bind(this)} style={styles.itemMenu}>
					<Text style={styles.fontMenu}>Sair</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  itemMenu: {
  	height: 44,
  	paddingLeft: 12,
  	paddingTop: 10,
  	marginTop: 5
  },
  fontMenu: {
  	fontSize: 16
  }
  
});