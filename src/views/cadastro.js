import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Meteor from 'react-native-meteor';
import ParkoNavigator from '../parkoNavigator';
import Background from '../comp/background';
import { stylesGeral, color } from '../estilos/geral';

export default class Cadastro extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	nome: "",
	  	email: "",
	  	senha: "",
	  	senha2: "",
	  	erro: "",
	  	logado: false
	  };
	}

	login() {
		this.props.navigator.push({name: 'login'});
	}

	async storeAccessToken(accessToken) {
	      try {
	        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
	      }
	      catch(erro) {

	      }
	}

	cadastrar() {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	if(!re.test(this.state.email)) {
    		this.setState({erro: "E-mail inválido."});
    	}
    	else if(this.state.nome.length < 3) {
    		this.setState({erro: "Nome inválido."});
    	}
		else if(this.state.senha.length < 6) {
			this.setState({erro: "A senha deve ter no mínimo 6 dígitos."});
		}
		else if(this.state.senha === this.state.senha2) {
			let context = this;
			Meteor.call('criarUsuarioPARKO', this.state, function (error, result) {
              if(error) {
              	context.setState({erro: error.message});
              	context.setState({logado: false});
              }
              else {
                context.storeAccessToken(result);
                context.setState({logado: true});
              }
            });		
		}
		else {
			this.setState({erro: "As senhas não conferem."});
		}
	}

	voltar() {
		this.props.navigator.pop();
	}

	render() {
		if(this.state.logado) {
			return(
				<ParkoNavigator/>
			);
		}
		return(
			<View style={styles.container}>
				<Background>
					<View style={styles.innerContainer}>
						<View style={styles.titleContainer}>
							<Text style={stylesGeral.title}>Cadastro</Text>
						</View>
						<TextInput style={styles.input} placeholderTextColor={color.light1} placeholder="Nome completo" onChangeText={(val) => this.setState({nome: val})}/>

						<TextInput style={styles.input} placeholderTextColor={color.light1} placeholder="E-mail" onChangeText={(val) => this.setState({email: val})} keyboardType="email-address"/>

						<TextInput style={styles.input} placeholderTextColor={color.light1} placeholder="Senha" onChangeText={(val) => this.setState({senha: val})} secureTextEntry={true}/>

						<TextInput style={styles.input} placeholderTextColor={color.light1} placeholder="Confirme a senha" onChangeText={(val) => this.setState({senha2: val})} secureTextEntry={true}/>

						<TouchableOpacity onPress={this.cadastrar.bind(this)}>
							<Text>Cadastrar</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.voltar.bind(this)}>
							<Text>Voltar</Text>
						</TouchableOpacity>
						<Text>
				            {this.state.erro}
				        </Text>
				    </View>
			    </Background>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	},
	titleContainer: {
		alignItems: 'center',
		marginBottom: 30,
	},
	input: {
		color: color.light1,
		padding: 4,
		fontSize: 18,
	},
	innerContainer: {
		marginTop: 65,
		marginLeft: 10,
		marginRight: 10
	}
});
