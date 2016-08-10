import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import { NativeModules } from 'react-native';
import Loading from '../comp/loading';
import Moment from 'moment';
import convertePlaca from '../functions/funcoesPlacas'

export default class CartoesCredito extends Component {

	onPress() {
		NativeModules.CardScan.scanCard()
	    	.then(function(result) { 
	            console.log('card-scan result: ', result);
	    });
	}

	render() {
		const {ready, pontos} = this.props;

		if(!ready) {
			return(
				<Loading/>
			);
		}
		else {
			return(
				<View>
					<TouchableOpacity onPress={this.onPress.bind(this)}>
						<Text>press</Text>
					</TouchableOpacity>
				</View>
			);
		}
	}
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('usuariosPlacas');

  return {
    ready: handle.ready(),
    pontos: Meteor.user().idCartao
  };
}, CartoesCredito)

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
