import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  ListView,
  Platform,
  TextInput,
  Picker,
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import { NativeModules } from 'react-native';
import Loading from '../comp/loading';
import ConfirmarPagamento from './confirmarPagamento';
import convertePlaca from '../functions/funcoesPlacas';
import ParkoButton from '../comp/parkoButton';
import ParkoTitulo from '../comp/parkoTitulo'; 
import { stylesGeral, color } from '../estilos/geral';

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
	  	dataSource: [],
	  	placaAlterada: false
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

	componentWillReceiveProps(props) {
		if(props.placas && props.placas.length == 1) {
			this.setState({placa: convertePlaca(props.placas[0].placa)});
		}
	}

	pagar(estacionamento) {
		let { placas } = this.props;
		let placa = '';
		if(placas.length == 0) {
			placa = convertePlaca(this.state.placa);
		}
		else if(placas.length > 1) {
			placa = this.state.placa;
		}
		else {
			if(this.state.placaAlterada) {
				placa = convertePlaca(this.state.placa);
			}
			else {
				placa = convertePlaca(placas[0].placa);
			}
		}

		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: ConfirmarPagamento,
	          title: 'Confirmar Pagamento',
	          passProps: {
	          	estacionamentoId: estacionamento._id,
	          	nome: estacionamento.nome,
	          	idRecebedor: estacionamento.idRecebedor,
	          	nomeEstacionamento: estacionamento.nome,
	          	enderecoEstacionamento: estacionamento.endereco + ", " + estacionamento.numero,
	          	placa: placa
	          }
	        });
		}
		else {
			this.props.navigator.push({ 
				name: 'confirmarPagamento',
				passProps: {
		          	estacionamentoId: estacionamento._id,
	          		nome: estacionamento.nome,
	          		idRecebedor: estacionamento.idRecebedor,
	          		nomeEstacionamento: estacionamento.nome,
	          		enderecoEstacionamento: estacionamento.endereco + ", " + estacionamento.numero,
					placa: placa
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
						<ParkoButton onPress={()=> this.pagar(estacionamento)} texto="Pagar" tamanho="menor"/>
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
					<ParkoTitulo texto="Pagamento"/>
					<Text style={[styles.listaVazia, stylesGeral.topico]}>Nenhum estacionamento encontrado perto de onde você está. Caso esteja dentro do estacionamento, aproxime-se da portaria e clique no botão abaixo.</Text> 
					<View style={{marginTop: 30}}>
						<ParkoButton onPress={this.atualizarPosicao.bind(this)} texto="Procurar estacionamento"/>
					</View>
				</View>
			);
		}
		else {
			let { placas, ready } = this.props;
			if(!ready) {
				return(<Loading/>);
			}
			else {
				let placasComponente = {};
				if(placas.length == 0) {
					placasComponente = (
						<TextInput style={styles.inputPlaca} autoCapitalize="characters" placeholder="Digite a placa do seu carro" onChangeText={(val)=> this.setState({placa: val})}/>
					);
				}
				else if(placas.length == 1) {
					placasComponente = (
						<View style={{marginLeft: 5}}>
							<Text style={stylesGeral.topico}>Placa utilizada:</Text>
							<View style={styles.inputPlacaView}>
								<TextInput style={styles.inputPlaca} autoCapitalize="characters" value={this.state.placa} onChangeText={(val)=> this.setState({placa: val, placaAlterada: true})}/>
							</View>
						</View>
					);
				}
				else {
					placasComponente = (
						<View>
							<ParkoTitulo texto="Pagamento"/>
							<Picker selectedValue={this.state.placa} onValueChange={(placa) => this.setState({placa: placa})} style={{width: 300}}>
								{placas.map((placa)=> (
									<Picker.Item label={convertePlaca(placa.placa)} value={convertePlaca(placa.placa)} key={placa.placa}/>
								))}
							</Picker>
						</View>
					);
				}
				return(
					<View>
						<ParkoTitulo texto="Pagamento"/>
				    	{ placasComponente }

				    	<View style={styles.containerList}>
							<ListView
						      dataSource={this.state.dataSource}
						      renderRow={this.renderRow.bind(this)}
						    />
						</View>
					</View>
				);
			}
		}
	}
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('usuariosPlacas');
  return {
    placas: Meteor.user() ? Meteor.user().placas : [],
    ready: handle.ready()
  };
}, Pagar)


const styles = StyleSheet.create({
  container: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	marginTop: 10
  },
  infor: {
  	color: color.dark2
  },
  containerList: {
	alignItems: 'center',
  	justifyContent: 'center',
  	marginTop: 30
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
  	marginTop: 5,
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
  	marginLeft: 10,
  },
  titulo: {
  	fontWeight: 'bold'
  },
  info: {
  	marginTop: 10
  },
  primeiraLinha: {
  	flex: 1,
  	color: color.light2
  },
  inputPlaca: {
  	color: color.light2,
  	borderBottomWidth: 0,
  	paddingBottom: 3,
  	borderColor: color.dark3,
  	width: 100,
  },
  inputPlacaView: {
  	width: 100,
  	borderColor: color.dark3,
  	borderWidth: 1,
  }
});
