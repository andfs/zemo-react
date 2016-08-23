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


export default class NovaReserva extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	placa: '',
	    	dtChegadaPrevista: Moment().add(2, 'hour').toDate(),
	    	data: Moment().add(2, 'hour').toDate(),
	    	tipoPermanencia: '',
	    	estacionamentoId: '',
	    	userId: '',
	    	erro: ''
	    };
	}

	reservar() {
		let placa = convertePlaca(this.state.placa);
		if(placa === "erro") {
			Alert.alert(
			  "Ooops...",
			  "Formato inválido da placa. Deve ser informado no seguinte formato: XXX-9999",
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
						<View style={styles.linha}>
							<Text style={styles.texto}>Placa</Text>
							<TextInput value={placas.placa} editable={false}/>
						</View>

						<View style={styles.linha}>
							<Text style={styles.texto}>Previsão de chegada</Text>
							<DatePicker
					          style={{width: 200}}
					          date={this.state.data}
					          mode="datetime"
					          format="DD/MM/YYYY HH:mm"
					          confirmBtnText="OK"
					          cancelBtnText="Cancelar"
					          showIcon={true}
					          onDateChange={(datetime) => {this.setState({dtChegadaPrevista: datetime});}}
					        />
					    </View>

						<View style={styles.linha}>
							<Text style={styles.texto}>Tipo de permanência</Text>
							<Picker
							  onValueChange={(tipoPermanencia) => this.setState({tipoPermanencia: tipoPermanencia})}>
							  <Picker.Item label="Horista" value="horista" />
							  <Picker.Item label="Diarista" value="diarista" />
							  <Picker.Item label="Pernoite" value="pernoite" />
							  <Picker.Item label="Mensalista" value="mensalista" />
							</Picker>
						</View>

						<View style={styles.botoes}>
							<ParkoButton onPress={this.reservar.bind(this)} texto="Cadastrar"/>
							<ParkoButton onPress={this.voltar.bind(this)} texto="Voltar"/>
						</View>
						<Text>
				            {this.state.erro}
				        </Text>
					</View>
				);
			}
			else if(placas) {
				return(
					<View style={styles.container}>
						<View style={styles.linha}>
							<Text style={styles.texto}>Placa</Text>
							<Picker onValueChange={(placa) => this.setState({placa: placa})} selectedValue={this.state.placa}>
								{placas.map((placa)=> (
									<Picker.Item label={placa.placa} value={placa.placa} key={placa.placa}/>
								))}
							</Picker>
						</View>

						<View style={styles.linha}>
							<Text style={styles.texto}>Previsão de chegada</Text>
							<DatePicker
					          style={{width: 200}}
					          date={this.state.data}
					          mode="datetime"
					          format="DD/MM/YYYY HH:mm"
					          confirmBtnText="OK"
					          cancelBtnText="Cancelar"
					          showIcon={true}
					          onDateChange={(datetime) => {this.setState({dtChegadaPrevista: datetime, data: datetime})}}
					        />
					    </View>

						<View style={styles.linha}>
							<Text style={styles.texto}>Tipo de permanência</Text>
							<Picker onValueChange={(tipoPermanencia) => this.setState({tipoPermanencia: tipoPermanencia})}>
							  <Picker.Item label="Horista" value="horista" />
							  <Picker.Item label="Diarista" value="diarista" />
							  <Picker.Item label="Pernoite" value="pernoite" />
							  <Picker.Item label="Mensalista" value="mensalista" />
							</Picker>
						</View>

						<View style={styles.botoes}>
							<ParkoButton onPress={this.reservar.bind(this)} texto="Cadastrar"/>
							<ParkoButton onPress={this.voltar.bind(this)} texto="Voltar"/>
						</View>
						<Text>
				            {this.state.erro}
				        </Text>
					</View>
				);
			}
			else {
				return(
					<View style={styles.container}>
						<View style={styles.linha}>
							<Text style={styles.texto}>Placa</Text>
							<TextInput value={placas.placa} onChangeText={(val) => this.setState({placa: val})}/>
						</View>

						<View style={styles.linha}>
							<Text style={styles.texto}>Previsão de chegada</Text>
							<DatePicker
					          style={{width: 200}}
					          date={Moment().toDate()}
					          mode="datetime"
					          format="DD/MM/YYYY HH:mm"
					          confirmBtnText="OK"
					          cancelBtnText="Cancelar"
					          showIcon={true}
					          onDateChange={(datetime) => {this.setState({dtChegadaPrevista: datetime, data: datetime})}}
					        />
					    </View>

						<View style={styles.linha}>
							<Text style={styles.texto}>Tipo de permanência</Text>
							<Picker
							  onValueChange={(tipoPermanencia) => this.setState({tipoPermanencia: tipoPermanencia})}>
							  <Picker.Item label="Horista" value="horista" />
							  <Picker.Item label="Diarista" value="diarista" />
							  <Picker.Item label="Pernoite" value="pernoite" />
							  <Picker.Item label="Mensalista" value="mensalista" />
							</Picker>
						</View>

						<View style={styles.botoes}>
							<ParkoButton onPress={this.reservar.bind(this)} texto="Cadastrar"/>
							<ParkoButton onPress={this.voltar.bind(this)} texto="Voltar"/>
						</View>
						<Text>
				            {this.state.erro}
				        </Text>
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
  linha: {
  	marginTop: 20
  },
  texto: {
  	marginLeft: 6
  },
  botoes: {
  	flexDirection: 'row',
  	flex: 1,
  	marginTop: 20
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    flex: 1
  }
  
});
