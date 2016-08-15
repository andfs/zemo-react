import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  TouchableHighlight,
  ListView
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import { NativeModules } from 'react-native';
import Loading from '../comp/loading';
import convertePlaca from '../functions/funcoesPlacas';

export default class ConfirmarPagamento extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	loading: true,
	  	valor: ''
	  };
	}

	voltar() {
		this.props.navigator.pop();
	}

	render() {
		let placasArray = [];
		let {ready}          = this.props;
		let placa            = this.props.route.passProps.placa;
		let estacionamentoId = this.props.route.passProps.estacionamentoId;

		if(!ready) {
			return(<Loading/>);
		}
		else {
			let movimentacao = Meteor.collection('movimentacoes').find({
									placa: placa,
									dtSaida: null,
									estacionamentoId: estacionamentoId
								});

			if(movimentacao.length == 0) {
				return(
					<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						<Text>Nenhuma movimentação encontrada com a placa {placa}</Text>
						<TouchableOpacity onPress={this.voltar.bind(this)}>
							<Text>Voltar</Text>
						</TouchableOpacity>
					</View>
				);
			}
			else {
				let context = this;
				if(movimentacao && movimentacao.length > 1) {
					Meteor.call('getValorPagar', movimentacao, function(error, result) {
						if(!error) {
							context.setState({valor: resut, loading: false});
						}
						else {
							context.setState({valor: 'erro', loading: false});	
						}
					});	
				}
				
				if(this.state.loading) {
					return(<Loading/>);
				}
				else {
					return(
						<View>
							<Text>{this.state.valor}</Text>						
						</View>
					);
				}
			}
		}
	}
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('movimentacoesApp');

  return {
    ready: handle.ready()
  };

}, ConfirmarPagamento)

const styles = StyleSheet.create({
  
  
});
