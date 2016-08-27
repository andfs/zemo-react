import React, { Component } from 'react';
import { 
	View, 
	TouchableHighlight,
	Text,
  	Modal,
  	StyleSheet,
  	LayoutAnimation,
  	TextInput
} from 'react-native';

import FCM from 'react-native-fcm';
import Meteor from 'react-native-meteor';
import { color } from '../estilos/geral';
import ParkoButton from './parkoButton';
import Loading from './loading';
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class ParkoPushNotification extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	state: '',
	  	mostrarModal: false,
	  	nomeEstacionamento: '',
	  	valor: '',
	  	idEstacionamento: '',
	  	showBotoes: true,
	  	showLoading: false,
	  	showMsg: false,
	  	msg: '',
	  	cpf: '',
	  	lastLength: 0,
	  	showErro: false
	  };
	}

	componentDidMount() {
		let context = this;
		
		FCM.requestPermissions();
	    FCM.getFCMToken().then(token => {
	    	if(token && token != null) {
	    		Meteor.call('atualizarToken', token);
	    	}
	    });

	    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
	      	this.setState({
	      					mostrarModal: true, 
	      					nomeEstacionamento: notif.nomeEstacionamento, 
	      					valor: notif.valor, 
	      					idEstacionamento: notif.idEstacionamento
	      	});
	    });

	    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
	      	if(token && token != null) {
	    		Meteor.call('atualizarToken', token);
	    	}
	    });
	}

	tratarCPF(cpf) {
		if(cpf.length == 3 || cpf.length == 7) {
			if(this.state.lastLength < cpf.length) {
				cpf = cpf + '.';
			}
		}
		else if(cpf.length == 4) {
			if(cpf.indexOf('.') === -1) {
				cpf = cpf.substring(0, 3) + '.' + cpf.substring(3);
			}
		}
		else if(cpf.length == 8) {
			if(cpf.lastIndexOf('.') < 7) {
				cpf = cpf.substring(0, 7) + '.' + cpf.substring(7);
			}
		}
		else if(cpf.length == 11) {
			if(this.state.lastLength < cpf.length) {
				cpf =  cpf + '-';
			}
		}
		else if(cpf.length == 8) {
			if(cpf.lastIndexOf('.') < 7) {
				cpf = cpf.substring(0, 7) + '.' + cpf.substring(7);
			}
		}
		else if(cpf.length == 12) {
			if(cpf.indexOf('-') === -1) {
				cpf = cpf.substring(0, 11) + '-' + cpf.substring(11);
			}
		}
		
		this.setState({lastLength: cpf.length, cpf: cpf, showErro: false});
	}

	componentWillUnmount() {
	    this.refreshUnsubscribe();
	    this.notificationUnsubscribe();
	}

	validarCpf() {
		let Soma = 0;
	    let Resto;
	    let strCPF = this.state.cpf.replace('.', '').replace('.', '').replace('-', '').trim();

		if (strCPF == "00000000000") return false;
	    
		for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
		Resto = (Soma * 10) % 11;
		
	    if ((Resto == 10) || (Resto == 11))  Resto = 0;
	    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
		
		Soma = 0;
	    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
	    Resto = (Soma * 10) % 11;
		
	    if ((Resto == 10) || (Resto == 11))  Resto = 0;
	    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
	    return true;
	}

	confirmar() {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		if(this.state.cpf.length < 14 || !this.validarCpf()) {
			this.setState({showErro: true, showLoading: false, msg: 'CPF inválido!'});
			this.refs.cpf.focus();
		}
		else {
			dismissKeyboard();
			this.setState({showBotoes: false, showLoading: true});
			let context = this;
			Meteor.call('cadastrarMensalista', Meteor.userId(), this.state.idEstacionamento, this.state.cpf, function (error, result) {
				if(!error) {
					context.setState({showMsg: true, showLoading: false, msg: 'Cadastro de mensalista realizado com sucesso!', cpf: ''});
				}
				else {
					context.setState({showMsg: true, showLoading: false, msg: 'Não conseguimos registrar sua requisição. Tente novamente', cpf: ''});
				}
			});
		}
	}

	cancelar() {
		this.setState({mostrarModal: false, showMsg: false, showBotoes: true, cpf: ''});
	}

	fecharModal() {
		this.setState({mostrarModal: false, showMsg: false, showBotoes: true, cpf: ''});
	}

	voltarEstadoInicial() {
		this.setState({
			state: '',
		  	mostrarModal: false,
		  	nomeEstacionamento: '',
		  	valor: '',
		  	idEstacionamento: '',
		  	showBotoes: true,
		  	showLoading: false,
		  	showMsg: false,
		  	msg: '',
		  	cpf: '',
		  	lastLength: 0,
		  	showErro: false
		});
	}

	render() {
		return (
		        <Modal
		          animationType={"slide"}
		          transparent={false}
		          visible={this.state.mostrarModal}
		          onRequestClose={() => {this.voltarEstadoInicial.bind(this)}}
		          >
			        <View style={style.container}>
			            <Text style={style.titulo}>Confirmação de Mensalista</Text>
			            <Text style={style.info}>
			            	Você confirma o cadastro como mensalista ?
			            </Text>
			        </View>
		            <View style={style.infoContainer}>
		            	<View style={{flexDirection: 'row'}}>
		            		<Text style={style.valor}>
			            		Estacionamento:
			            	</Text>
			            	<Text>
			            		{this.state.nomeEstacionamento}
			            	</Text>
		            	</View>
		            	<View style={{flexDirection: 'row'}}>
		            		<Text style={style.valor}>
			            		Valor:
			            	</Text>
			            	<Text>
			            		{this.state.valor} por mês
			            	</Text>
		            	</View>
		            	<View style={{flexDirection: 'row'}}>
		            		<Text style={style.valorCPF}>
			            		Entre com seu CPF:
			            	</Text>
			            	<TextInput ref="cpf" maxLength={14} value={this.state.cpf} keyboardType="numeric" onChangeText={this.tratarCPF.bind(this)} style={{flex: 1, paddingBottom: 2, marginBottom: 5}}/>
		            	</View>
		            </View>
		            <Text style={style.msg}>Caso confirme, o valor acima será debitado mensalmente no seu cartão de crédito.</Text> 
		            <View>
		            	{this.state.showErro ? 
		            		<View style={style.botoes}>
		            			<Text style={style.erro}>{this.state.msg}</Text>
		            		</View> : null}

		            	{this.state.showBotoes ? 
		            		<View style={style.botoes}>
		            			<ParkoButton texto="Confirmo" onPress={this.confirmar.bind(this)} tamanho="medio"/>
		            			<ParkoButton texto="Cancelar" onPress={this.cancelar.bind(this)} tamanho="medio"/>
		            		</View>
		            		: null
		            	}

		            	{this.state.showLoading ? <Loading/> : null}

		            	{this.state.showMsg ? 
		            		<View style={style.botoes}>
		            			<Text style={style.msg}>{this.state.msg}</Text>
		            			<ParkoButton texto="Ok" onPress={this.fecharModal.bind(this)} tamanho="medio"/>
		            		</View>
		            	 : null}
		            </View>
		        </Modal>
		);
	}
}

const style = StyleSheet.create({

	container: {
		marginTop: 60,
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	botoes: {
		marginTop: 25,
		alignItems: 'center'
	},
	titulo: {
		color: color.dark2,
		fontSize: 24,
		fontWeight: 'bold'
	},
	info: {
		color: color.dark2,
		marginLeft: 10
	},
	msg: {
		marginLeft: 10, 
		marginTop: 10, 
		fontSize: 10
	},
	erro: {
		marginLeft: 10, 
		marginTop: 10, 
		color: 'red',
		fontWeight: 'bold'
	},
	valor: {
		color: color.dark2,
		fontWeight: 'bold',
		marginRight: 3	
	},
	valorCPF: {
		color: color.dark2,
		fontWeight: 'bold',
		marginRight: 3,
		marginTop: 10	
	},
	infoContainer: {
		marginLeft: 10,
		marginTop: 20
	}
});