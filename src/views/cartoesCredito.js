import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  LayoutAnimation,
  AsyncStorage
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import { NativeModules } from 'react-native';
import Loading from '../comp/loading';
import Moment from 'moment';
import convertePlaca from '../functions/funcoesPlacas';
import ParkoButton from '../comp/parkoButton';
import ParkoTitulo from '../comp/parkoTitulo';
import { stylesGeral } from '../estilos/geral';

class ContainerCartao extends Component {

	render() {
		return(
			<View style={styles.infoContainer}>
				<View style={styles.info}>
					<Text style={stylesGeral.topico}>Nome do titular do cartão:</Text>
					<Text style={stylesGeral.respostaTopico}>
						{this.props.nomeTitularCartao}
					</Text>
				</View>

				<View style={styles.info}>
					<Text style={stylesGeral.topico}>Cartão: 
						{this.props.cartao}
					</Text>
					<Text style={stylesGeral.respostaTopico}>
						{this.props.numeroCartao}
					</Text>
				</View>

				<View style={styles.info}>
					<Text style={stylesGeral.topico}>Validade:</Text>
					<Text style={stylesGeral.respostaTopico}>
						{this.props.validade}
					</Text>
				</View>

				<View style={styles.center}>
					<View style={styles.info}>
						<ParkoButton onPress={this.props.confirmacao} texto="Confirmo as informações acima" tamanho="medio"/>
					</View>

					<View style={styles.info}>
						<ParkoButton onPress={this.props.cancelar} texto="Cancelar" tamanho="medio"/>
					</View>
				</View>
			</View>
		);
	}
}

export default class CartoesCredito extends Component {

	async getCartaoKey() {
		try 
		{
			this.setState({loading: true});
		  	const value = await AsyncStorage.getItem('@parko!id@Card');
		  	if(value !== null) {
		  		this.setState({cartaoSalvo: value});
		  		fetch('https://api.pagar.me/1/cards/'+value+'?api_key=ak_test_T6dP4UisH26UhIbsFc80hnR4CUd26R', {
				  method: 'GET',
				  headers: {
				    'Accept': 'application/json',
				    'Content-Type': 'application/json',
				  }
				}).then((response) => response.json())
			      .then((responseJson) => {
			       	this.setState({
			    			cardType: responseJson.brand,
						  	redactedCardNumber: '**** **** **** '+ responseJson.last_digits,
						  	cardholderName: responseJson.holder_name,
						  	loading: false
			    		});
			      })
			      .catch((error) => {
			        this.setState({loading: false});
			      });
		  	}
		}
		catch (error) 
		{
			this.setState({loading: false});
		  	return null;
		}
	}

	componentDidMount() {
		this.getCartaoKey().done();
	}

	constructor(props) {
	  super(props);
	  
	  this.state = {
	  	loading: false,
	  	cartaoOk: false,
	  	cartaoSalvo: null,
	  	cardType: '',
	  	expiryMonth: '',
	  	expiryYear: '',
	  	formattedCardNumber: '',
	  	isExpiryValid: false,
	  	redactedCardNumber: ''
	  };
	}

	cancelar() {
		this.getCartaoKey().done();
		this.setState({cartaoOk: false});
	}

	onPress() {
		let context = this;
		NativeModules.CardScan.scanCard().then(function(result) {
	    		LayoutAnimation.spring();
	    		context.setState({
	    			cartaoOk: true,
	    			cardType: result.cardType,
				  	expiryMonth: result.expiryMonth,
				  	expiryYear: result.expiryYear,
				  	formattedCardNumber: result.formattedCardNumber,
				  	isExpiryValid: result.isExpiryValid,
				  	redactedCardNumber: result.redactedCardNumber,
				  	cardholderName: result.cardholderName.toString().toUpperCase()
	    		});
	    });
	}

	confirmacao() {
		fetch('https://api.pagar.me/1/cards', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    api_key: 'ak_test_T6dP4UisH26UhIbsFc80hnR4CUd26R',
		    card_number: this.state.formattedCardNumber,
		    card_expiration_date: this.state.expiryMonth + this.state.expiryYear.toString().substr(2),
		    holder_name: this.state.cardholderName
		  })
		}).then((response) => response.json())
	      .then((responseJson) => {
	        AsyncStorage.setItem('@parko!id@Card', responseJson.id, function(error) {
	        	if(error) {
	        		Alert.alert(
					  "Erro",
					  "Não conseguimos salvar seu cartão. Tente novamente mais tarde.",
					  [
					    {text: 'Ok'}
					  ]
					);
	        	}
	        	else {
	        		Alert.alert(
					  "Sucesso",
					  "Seu cartão foi salvo com sucesso e com segurança. Agora você já pode reservar vagas e pagar estacionamentos com o Parko.",
					  [
					    {text: 'Ok'}
					  ]
					);
	        	}
	        });
	      })
	      .catch((error) => {
	        console.error(error);
	      });
	}

	renderNovoCartao() {
		const {ready, pontos} = this.props;
		let botao = (
				<ParkoButton onPress={this.onPress.bind(this)} texto="Clique para escanear seu cartão de crédito"/>
			);
		if(!ready) {
			return(
				<Loading/>
			);
		}
		else if(!this.state.cartaoOk){
			return(
				<View style={styles.container}>
					<ParkoTitulo texto="Cartão de Crédito" />
					{botao}
				</View>
			);
		}
		else {
			return(
				<View>
					<View style={styles.container}>
						<ParkoTitulo texto="Cartão de Crédito"/>
						{botao}
					</View>
					<ContainerCartao nomeTitularCartao={this.state.cardholderName} cartao={this.state.cardType} 
						numeroCartao={this.state.redactedCardNumber} validade={this.state.expiryMonth + "/" + this.state.expiryYear}
						confirmacao={this.confirmacao.bind(this)} cancelar={this.cancelar.bind(this)}/>
				</View>
			);
		}
	}
	renderCartaoExistente(cartao) {
		  if(this.state.cartaoOk) {
				return(
					<View>
						<View style={styles.container}>
							<ParkoTitulo texto="Cartão de Crédito"/>
							<ParkoButton onPress={this.onPress.bind(this)} texto="Editar Cartão"/>
						</View>
						<ContainerCartao nomeTitularCartao={this.state.cardholderName} cartao={this.state.cardType} 
							numeroCartao={this.state.redactedCardNumber} validade={this.state.expiryMonth + "/" + this.state.expiryYear}
							confirmacao={this.confirmacao.bind(this)} cancelar={this.cancelar.bind(this)}/>
					</View>
				);
			}
			else {
				return(
					<View>
						<View style={styles.container}>
							<ParkoTitulo texto="Cartão de Crédito"/>
							<ParkoButton onPress={this.onPress.bind(this)} texto="Editar Cartão"/>
						</View>
						<View style={styles.infoContainer}>
							<View style={styles.info}>
								<Text style={stylesGeral.topico}>Nome do titular do cartão:</Text>
								<Text style={stylesGeral.respostaTopico}>{this.state.cardholderName}</Text>
							</View>

							<View style={styles.info}>
								<Text style={stylesGeral.topico}>Cartão: {this.state.cardType}</Text>
								<Text style={stylesGeral.respostaTopico}>{this.state.redactedCardNumber}</Text>
							</View>

						</View>
					</View>
				);
			}
	}

	render() {
		if(this.state.loading) {
			return (<Loading/>);
		}
		else if(this.state.cartaoSalvo) {
			return this.renderCartaoExistente(this.state.cartaoSalvo);
		}	
		else {
			return this.renderNovoCartao();
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
  	justifyContent: 'center',
  	marginTop: 10
  },
  infoContainer: {
  	marginLeft: 12,
  	marginTop: 10
  },
  info: {
  	marginTop: 10
  },
  center: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	marginTop: 10
  }
});
