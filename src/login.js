'use strict'

import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import ParkoNavigator from './parkoNavigator';
import Meteor, { connectMeteor, Accounts } from 'react-native-meteor';
import Loading from './comp/loading';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK;

const ACCESS_TOKEN = 'parkoAccess_Token';
Meteor.connect('ws://localhost:3000/websocket');


export default class Login extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      nome: "",
      email: "",
      senha: "",
      erro: "",
      logado: false,
      ok: false
    };
  }

  componentWillMount() {
    this.getAccessToken();
  }

  async storeAccessToken(accessToken) {
      try {
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      }
      catch(erro) {

      }
  }

  async getAccessToken() {
      try {
        var accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
        if(!accessToken) {
            this.setState({logado: false, ok: true});
        } else {
            if(!accessToken) {
                this.setState({logado: false, ok: true});
            }
            var context = this;
            Meteor.call('validarId', accessToken, function (error, result) {
              context.setState({ok: true});
              if(error || !result) {
                  context.setState({logado: false});
              }
              else {
                context.setState({logado: true});
              }
            });
        }
      } catch(error) {
          this.setState({ok: true});
      }
  }

  recuperarSenha() {
    let email = this.state.email;
    let context = this;
    if(!email) {
      this.setState({erro: 'Preencha o email para lhe enviarmos sua nova senha.'});
    }
    else {
      Accounts.forgotPassword({email: email}, function(error) {
          if(error) {
            context.setState({erro: 'Não conseguimos lhe enviar o e-mail.'});
          }
          else {
            context.setState({erro: 'Confira seu e-email. Enviamos o link para a alteração de sua senha.'}); 
          }
      });
    }
  }

  cadastrar() {
    this.props.navigator.push({name: 'cadastro'});
  }

  loginProprio() {
      let email = this.state.email;
      let senha = this.state.senha;
      if(email.length == 0) {
          this.setState({erro: "E-mail inválido."});
      }
      if(senha.length == 0) {
          this.setState({erro: "Senha inválida."}); 
      }

      let context = this;
      
      this.setState({ok: true});
      Meteor.loginWithPassword(email, senha, function(erro) {
          if(erro) {
              context.setState({erro: "Login ou senha inválidos."});
          }
          else {
            context.setState({erro: ""});
            context.storeAccessToken(Meteor.userId());
            context.setState({logado: true});
          }
      });
  }

  loginFacebook(error, result) {
    this.setState({ok: true});
    if (error) {
      alert("login has error: " + result.error);
    } else if (result.isCancelled) {
      alert("login is cancelled.");
    } else {
      var context = this;
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          context.storeAccessToken(data.accessToken.toString());
          context.setState({logado: true});
          AsyncStorage.setItem('loginFacebookParko', 'true', function(error) {
            if(error) {
              console.log(error.message)
            }
            else {
              console.log('login facebook');
            }
          });
          Meteor.call('loginFacebook', data, function(error) {
            if(error) {
              alert(error.message);
            }
          });
        }
      )
    }
  }

  render() {
    if(this.state.ok) 
    {
      if(this.state.logado) {
        return (<ParkoNavigator/>);
      }
      return (
        <View style={styles.container}>
                  <Text style={styles.title}>PARKO</Text>
                  <LoginButton style={styles.button}
                    readPermissions={["email", "user_friends"]}
                    onLoginFinished={this.loginFacebook.bind(this)}
                    onLogoutFinished={() => alert("logout.")}/>
                   
                    <TextInput style={styles.inputA} placeholder="Email" keyboardType="email-address" onChangeText={(val) => this.setState({email: val})}/>
                    <TextInput style={styles.input} placeholder="Senha" 
                        onChangeText={(val) => this.setState({senha: val})}
                        secureTextEntry={true}/>

                    <TouchableHighlight onPress={this.loginProprio.bind(this)}>
                        <Text>Login</Text>
                    </TouchableHighlight>
                      <TouchableHighlight style={styles.cadastrar} onPress={this.cadastrar.bind(this)}>
                        <Text style={{color: '#0000ff', borderColor: '#0000ff'}}>Cadastrar</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.esqueciSenha} onPress={this.recuperarSenha.bind(this)}>
                        <Text style={{color: '#0000ff', borderColor: '#0000ff'}}>Esqueci minha senha</Text>
                      </TouchableHighlight>
                    <Text>
                      {this.state.erro}
                    </Text>

            </View> 
      );
    }
    else {
      return (
        <Loading/>      
      );
    }
  }
}

const styles = StyleSheet.create({

  capa: {
    flex: 1,
    flexDirection: 'row'
  },
  cadastrar: {
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
  },
  esqueciSenha: {
    alignSelf: 'flex-end',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 180
  },
  button: {
    height: 30,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  title: {
    fontSize: 25,
    marginBottom: 15
  },
  inputA: {
    height: 30,
    alignSelf: 'stretch',
    marginTop: 20,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  input: {
    height: 30,
    alignSelf: 'stretch',
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  }
});