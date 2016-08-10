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
				<TouchableOpacity>
					<Text>Home</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.pagamento.bind(this)}>
					<Text>Pagamento</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.reservarVagas.bind(this)}>
					<Text>Reservar Vaga</Text>
				</TouchableOpacity>

				<TouchableOpacity>
					<Text>Estacionar/Pagar</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.meusPontos.bind(this)}>
					<Text>Meus Pontos</Text>
				</TouchableOpacity>

				<TouchableOpacity>
					<Text>Meus Vouchers</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.minhasPlacas.bind(this)}>
					<Text>Minhas Placas</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.logout.bind(this)}>
					<Text>Sair</Text>
				</TouchableOpacity>
			</View>
		);
	}
}