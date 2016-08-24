import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Picker,
  Alert
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import Loading from '../comp/loading';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import convertePlaca from '../functions/funcoesPlacas';
import ParkoButton from '../comp/parkoButton';
import ParkoTitulo from '../comp/parkoTitulo';
import { stylesGeral, color } from '../estilos/geral';

class NovaReservaComponente extends Component {

	render() {
		return(
			<View>
				<View style={styles.linha}>
					<Text style={stylesGeral.topico}>Previsão de chegada:</Text>
					<DatePicker
			          style={{marginTop: 5, width: 210}}
			          date={this.props.pai.state.dtChegadaPrevista}
			          mode="datetime"
			          format="DD/MM/YYYY HH:mm"
			          confirmBtnText="OK"
			          cancelBtnText="Cancelar"
			          showIcon={true}
			          customStyles={{
					    dateText: {
					      color: 'white'
					    },
					    dateInput: {
					    	borderColor: color.dark3
					    }
					  }}
			          onDateChange={(datetime) => {this.props.pai.setState({dtChegadaPrevista: datetime})}}
			        />
			    </View>

				<View style={styles.linha}>
					<Text style={stylesGeral.topico}>Tipo de permanência:</Text>
					<View style={{marginTop: 5, borderWidth: 1,borderColor: color.dark3, width: 200}}>
						<Picker style={styles.picker} selectedValue={this.props.pai.state.tipoPermanencia}
						  onValueChange={(tipoPermanencia) => this.props.pai.setState({tipoPermanencia: tipoPermanencia})}>
						  <Picker.Item label="Hora" value="horista" />
						  <Picker.Item label="Diária" value="diarista" />
						  <Picker.Item label="Pernoite" value="pernoite" />
						  <Picker.Item label="Mensalista" value="mensalista" />
						</Picker>
					</View>
				</View>

				<View style={styles.botoes}>
					<ParkoButton onPress={this.props.reservar} texto="Reservar" tamanho="medio"/>
					<ParkoButton onPress={this.props.voltar} texto="Voltar" tamanho="medio"/>
				</View>
				<Text>
		            {this.props.erro}
		        </Text>
			</View>
		);
	}
}
export default class NovaReserva extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	placa: '',
	    	dtChegadaPrevista: Moment().add(2, 'hour').toDate(),
	    	tipoPermanencia: '',
	    	estacionamentoId: '',
	    	userId: '',
	    	erro: ''
	    };
	}

	reservar() {
		const { placas, ready } = this.props;
		if(ready) {
			let placa = convertePlaca(this.state.placa.length > 0 ? this.state.placa : placas[0].placa);
			if(placa === "erro") {
				Alert.alert(
				  "Ooops...",
				  "Formato inválido da placa. Deve ser informado no seguinte formato: XXX-9999. Placa: " + this.state.placa,
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ]
				);
			}
			else {
				let context = this;
				Meteor.collection('reservas').insert({
													  placa: placa, 
													  dtReserva: new Date(), 
													  dtChegadaPrevista: this.state.dtChegadaPrevista,
													  tipoPermanencia: this.state.tipoPermanencia,
													  estacionamentoId: this.props.estacionamento._id,
													  userId: Meteor.userId() }, function(error) {


					if(error) {
						Alert.alert(
						  "Ooops...",
						  error.message,
						  [
						    {text: 'OK', onPress: () => console.log('OK Pressed')},
						  ]
						);
					}
					else {
						Alert.alert(
						  "Sucesso",
						  "Sua reserva está confirmada. Você tem até 15 minutos de tolerância para manter sua reserva.",
						  [
						    {text: 'OK', onPress: () => context.props.navigator.pop()},
						  ]
						);
					}
				});
			}
		}
	}

	voltar() {
		this.props.navigator.pop();
	}

	render() {
		const { placas, ready } = this.props;
		if(!ready) {
			return (<Loading/>);
		}
		else if(ready) {
			if(placas && placas.length == 1) {
				return(
					<View style={styles.container}>
						<ParkoTitulo texto="Nova Reserva"/>
						<View style={styles.umaPlaca}>
							<Text style={stylesGeral.topico}>Placa: </Text>
							<Text style={stylesGeral.respostaTopico}> {convertePlaca(placas[0].placa)} </Text>
						</View>

						<NovaReservaComponente erro={this.state.erro} pai={this} data={this.state.dtChegadaPrevista}
							reservar={this.reservar.bind(this)} voltar={this.voltar.bind(this)}/>
					</View>
				);
			}
			else if(placas) {
				return(
					<View style={styles.container}>
						<ParkoTitulo texto="Nova Reserva"/>
						<View style={styles.linha}>
							<Text style={stylesGeral.topico}>Placa</Text>
							<Picker onValueChange={(placa) => this.setState({placa: placa})} selectedValue={this.state.placa}>
								{placas.map((placa)=> (
									<Picker.Item label={placa.placa} value={placa.placa} key={placa.placa}/>
								))}
							</Picker>
						</View>

						<NovaReservaComponente erro={this.state.erro} pai={this} data={this.state.dtChegadaPrevista}
							reservar={this.reservar.bind(this)} voltar={this.voltar.bind(this)}/>
					</View>
				);
			}
			else {
				return(
					<View style={styles.container}>
						<ParkoTitulo texto="Nova Reserva"/>
						<View style={styles.linha}>
							<Text style={stylesGeral.topico}>Placa</Text>
							<TextInput onChangeText={(val) => this.setState({placa: val})} style={stylesGeral.respostaTopico}/>
						</View>

						<NovaReservaComponente erro={this.state.erro} pai={this} data={this.state.dtChegadaPrevista}
							reservar={this.reservar.bind(this)} voltar={this.voltar.bind(this)}/>
					</View>
				);
			}
		}
		}
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('usuariosPlacas');

  return {
    ready: handle.ready(),
    placas: Meteor.user().placas
  };
}, NovaReserva)

const styles = StyleSheet.create({
  container: {
  	flex: 1,
  	marginLeft: 10
  },
  umaPlaca: {
  	flexDirection: 'row',
  },
  linha: {
  	marginTop: 20
  },
  botoes: {
  	marginTop: 40,
  	alignItems: 'center',
  	justifyContent: 'center'
  },
  picker: {
   color: color.light2,
   borderColor: color.dark3,
   height: 40,
  }
  
});
