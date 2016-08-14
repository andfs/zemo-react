import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  Platform,
  TextInput
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import { NativeModules } from 'react-native';
import Loading from '../comp/loading';
import ConfirmarPagamento from './confirmarPagamento';

export default class Pagar extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	loading: true,
	  	latitude: '',
	  	placa: '',
	  	listaVazia: false,
	  	showPlacas: false,
	  	longitude: '',
	  	dataSource: []
	  };
	}

	procurarEstacionamento() {
		let context = this;
      	Meteor.call('buscarEstacionamento', this.state.latitude, this.state.longitude, function (error, result) {
      		if(!result || result.length == 0) {
      			LayoutAnimation.spring();
      			context.setState({listaVazia: true, loading: false});
      		}
      		else {
      			let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      			LayoutAnimation.spring();
	      		context.setState({dataSource: ds.cloneWithRows(result), loading: false, listaVazia: false});
      		}
      	});
	}

	atualizarPosicao() {
		navigator.geolocation.getCurrentPosition(
	      (position) => {
	      		this.setState({latitude:position.coords.latitude, longitude: position.coords.longitude});
	      		this.procurarEstacionamento();
	      },
	      (error) => alert(error),
	      {enableHighAccuracy: true, timeout: 2000}
	    );
	}

	componentDidMount() {
		this.atualizarPosicao();
	}

	pagar(estacionamentoId) {
		console.log('pagar'+estacionamentoId);
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: ConfirmarPagamento,
	          title: 'Confirmar Pagamento',
	          passProps: {
	          	estacionamentoId: estacionamentoId
	          }
	        });
		}
		else {
			this.props.navigator.push({ 
								name: 'confirmarPagamento',
								passProps: {
						          	estacionamentoId: estacionamentoId
						         }
						     });
		}
	}

	renderRow(estacionamento) {
		if(estacionamento) {
			return(
				<View style={styles.containerRow}>
					<View style={styles.linhaRow}>
						<Text style={styles.flex1}>{estacionamento.nome}</Text>
						<TouchableOpacity onPress={()=> this.pagar(estacionamento._id)}>
							<Text style={styles.flexRight}>Pagar</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.endereco}>
						<Text style={styles.infor}>{estacionamento.endereco} - {estacionamento.numero}</Text>
					</View>
				</View>
			);
		}
	}

	render() {
		if(this.state.loading) {
			return(<Loading/>);
		}
		else if(this.state.listaVazia) {
			return(
				<View style={styles.container}>
					<Text style={styles.listaVazia}>Nenhum estacionamento encontrado perto de onde você está. Caso esteja dentro do estacionamento, aproxime-se da portaria e clique no botão abaixo.</Text> 
					<TouchableOpacity onPress={this.atualizarPosicao.bind(this)}>
						<Text>Procurar estacionamento.</Text> 
					</TouchableOpacity>
				</View>
			);
		}
		else {
			let { placas } = this.props;
			let placasComponente = {};
			if(placas.length == 0) {
				placasComponente = (
					<TextInput placeholder="Digite a placa do seu carro" onChange={(val)=> this.setState({placa: val})}/>
				);
			}
			else if(placas.length == 1) {
				placasComponente = (
					<Text>{placas[0].placa}</Text>
				);
			}
			else {
				placasComponente = (
					<Text>er</Text>
				);
			}
			return(
				<View style={styles.container}>
					<View style={styles.placas}>
				    	{ placasComponente }
				    </View>

					<ListView
				      dataSource={this.state.dataSource}
				      renderRow={this.renderRow.bind(this)}
				    />
				</View>
			);
		}
	}
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('usuariosPlacas');

  return {
    placas: Meteor.user().placas
  };
}, Pagar)


const styles = StyleSheet.create({
  container: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	marginTop: 10
  },
  placas: {
  	marginTop: 10
  },
  flexRight: {
  	flex: 1, 
  	textAlign: 'right',
  	fontWeight: 'bold',
  	fontSize: 24
  },
  endereco: {
  	marginTop: 5
  },
  containerRow: {
  	marginLeft: 5, 
  	marginRight: 5,
  	paddingBottom: 5,
  	borderBottomWidth: 1
  },
  linhaRow: {
  	flexDirection: 'row'
  },
  flex1: {
  	flex: 1,
  	fontWeight: 'bold',
  	fontSize: 24
  },
  listaVazia: {
  	marginLeft: 5,
  },
  titulo: {
  	fontWeight: 'bold'
  },
  info: {
  	marginTop: 10
  },
  primeiraLinha: {
  	flex: 1
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