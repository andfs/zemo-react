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

	render() {
		return(
			<View style={estiloMenu.drawer}>
				<TouchableOpacity>
					<Text>Home</Text>
				</TouchableOpacity>

				<TouchableOpacity>
					<Text>Reservar Vaga</Text>
				</TouchableOpacity>

				<TouchableOpacity>
					<Text>Estacionar/Pagar</Text>
				</TouchableOpacity>

				<TouchableOpacity>
					<Text>Meus Pontos</Text>
				</TouchableOpacity>

				<TouchableOpacity>
					<Text>Meus Vouchers</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.logout.bind(this)}>
					<Text>Sair</Text>
				</TouchableOpacity>
			</View>
		);
	}
}