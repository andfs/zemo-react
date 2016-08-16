import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  ListView,
  AsyncStorage
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import { NativeModules } from 'react-native';
import Loading from '../comp/loading';
import convertePlaca from '../functions/funcoesPlacas';
import Moment from 'moment';

export default class ConfirmarPagamento extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	loading: true,
	  	valor: '',
	  	pago: false,
	  	loadingCard: true,
	  	movimentacaoId: ''
	  };
	}

	voltar() {
		this.props.navigator.pop();
	}
	async getCartaoKey() {
		try {
			const value = await AsyncStorage.getItem('@parko!id@Card');
			this.setState({cardKey: value, loadingCard: false});	
		}
		catch(error) {
			alert(error);
		}
		
	}

	pagar() {
		let transaction = {
			api_key: 'ak_test_T6dP4UisH26UhIbsFc80hnR4CUd26R',
			amount: this.state.valor.replace('.', '').replace(',', '').replace('R$', '').trim(),
			card_id: this.state.cardKey,
			payment_method: 'credit_card',
			postback_url: 'http://localhost:3000/api/v1/processar_pagamento',
			async: true,
			soft_descriptor: 'parko ' + this.props.route.passProps.nome.toString().substring(0, 7),
			split_rules: [ {
				recipient_id: this.props.route.passProps.idRecebedor,
				charge_processing_fee: true,
				percentage: 100
			}],
			metadata: {
				idUsuario: Meteor.userId(),
				idEstacionamento: this.props.route.passProps.estacionamentoId,
				movimentacaoId: this.state.movimentacaoId
			}
		};
		
		fetch('https://api.pagar.me/1/transactions', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(transaction)
		}).then((response) => response.json())
	      .then((responseJson) => {
	        this.setState({pago: true});
	      })
	      .catch((error) => {
	        alert(error);
	      });
		
	}
	componentDidMount() {
		this.getCartaoKey().done();
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
			let movimentacao = Meteor.collection('movimentacoes').findOne({
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
				if(movimentacao && this.state.valor === '') {
					Meteor.call('getValorPagar', movimentacao, function(error, result) {
						if(!error) {
							context.setState({valor: result, loading: false, movimentacaoId: movimentacao._id});
						}
						else {
							context.setState({valor: 'erro', loading: false});	
						}
					});	
				}
				
				if(this.state.loading || this.state.loadingCard) {
					return(<Loading/>);
				}
				else if(this.state.pago){
					return(
						<View style={styles.container}>
							<Text>O valor devido ao estacionamento é de:</Text>
							<View style={styles.valorView}>
								<Text style={styles.valor}> {this.state.valor} </Text>
								<TouchableOpacity style={styles.button} onPress={this.pagar.bind(this)}>
									<Text style={{color: 'white'}}>Confirmar Pagamento</Text>
								</TouchableOpacity>
							</View>
							<Text>Pagamento está sendo processado. Você será notificado em breve.</Text>
							<TouchableOpacity style={styles.button} onPress={this.voltar.bind(this)}>
								<Text style={{color: 'white'}}>Voltar</Text>
							</TouchableOpacity>

						</View>
					);
				}
				else {
					return(
						<View style={styles.container}>
							<Text>O valor devido ao estacionamento é de:</Text>
							<View style={styles.valorView}>
								<Text style={styles.valor}> {this.state.valor} </Text>
								<TouchableOpacity style={styles.button} onPress={this.pagar.bind(this)}>
									<Text style={{color: 'white'}}>Confirmar Pagamento</Text>
								</TouchableOpacity>
							</View>
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
  container: {
  	flex: 1,
  	alignItems: 'center',
  	marginTop: 20
  },
  valorView: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	marginTop: 20
  },
  valor: {
  	fontWeight: 'bold',
  	fontSize: 28
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
    width: 250
  }
  
});
