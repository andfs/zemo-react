import React, { Component } from 'react';
import { 
	View, 
	TouchableHighlight,
	Text,
  	Modal,
  	StyleSheet
} from 'react-native';

import FCM from 'react-native-fcm';
import Meteor from 'react-native-meteor';
import { color } from '../estilos/geral';
import ParkoButton from './parkoButton';

export default class ParkoPushNotification extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	state: '',
	  	mostrarModal: false,
	  	nomeEstacionamento: '',
	  	valor: ''
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
	      	this.setState({mostrarModal: true, nomeEstacionamento: notif.nomeEstacionamento, valor: notif.valor});
	    });

	    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
	      	if(token && token != null) {
	    		Meteor.call('atualizarToken', token);
	    	}
	    });
	}

	componentWillUnmount() {
	    this.refreshUnsubscribe();
	    this.notificationUnsubscribe();
	}

	confirmar() {
		this.setState({mostrarModal: false});
	}

	cancelar() {
		this.setState({mostrarModal: false});
	}

	render() {
		return (
		        <Modal
		          animationType={"slide"}
		          transparent={false}
		          visible={this.state.mostrarModal}
		          onRequestClose={() => {}}
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
		            </View>
		            <Text style={{marginLeft: 10, marginTop: 10, fontSize: 10}}>Caso confirme, o valor acima será debitado mensalmente no seu cartão de crédito.</Text> 
		            <View style={style.botoes}>
		            	<ParkoButton texto="Confirmo" onPress={this.confirmar.bind(this)} tamanho="medio"/>
		            	<ParkoButton texto="Cancelar" onPress={this.cancelar.bind(this)} tamanho="medio"/>
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
	valor: {
		color: color.dark2,
		fontWeight: 'bold',
		marginRight: 3	
	},
	infoContainer: {
		marginLeft: 10,
		marginTop: 20
	}
});