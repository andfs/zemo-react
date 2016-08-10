import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ListView,
  Platform,
  TabBarIOS,
  Alert
} from 'react-native';

import Meteor, { createContainer, MeteorComplexListView } from 'react-native-meteor';
import Loading from '../comp/loading';
import NovaReserva from './novaReserva';
import TabNavigator from 'react-native-tab-navigator';
import Moment from 'moment';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

const historyIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEK0lEQVRoQ82ajXEUMQyFlQqACiAVABUAFQAVABUAFQAVkFQAVABUkKQCoAJIBUAFMN+O343Wtz9eW87FMzuXm3FsPT3pWdbekcWNO2b2wMzupYfvPH78MjOe7+m5SN+brThqXAFDn5nZ8wmjS5cG2ImZfW0BVQsEAG8SABn818zOk6f5lPc9ILH0MLHG5w034aOZvasBtBXITTN7nwH4ZGZf0lPKgp/3xMx4YFYDQK/N7E/pgluAsNkHMwMM3icceIo3WzEKtgjRV4kl1n1R6qBSILDABgximb8JnZLxLU26XzI55RqMIBwMnAU7i2MNCN7/bGbEMiwAgE22jH9p8tpe+ZqwAwhyiJx7usT+0uKAOEtJCQjAIJtbRy0Q9kHKAQEY9n40B2YJCCAw/kdKxtJQyoG2ABEYouBuyheY2RtzQKD0ZQonvFILgg1bgeTMnLp83QGaAoI6kRct4eQ9FgEkBwMrSP4sEPLiZ5JYpG9rYk+xHgWEtREAjgCk+djnS84IhnMwIbEwEzEigWAPyY80cxADbBgeCAcSbBBSrXnRI7S0JnaiYCgZrAz564GIDWqdtxFUpDWiGWFZ7KPW27EiIGKDSbcCy44o1cr96u0dWBGQPYTXnBHMUwRRvpwICLkByj1ZCwDUI7QwS8cEOXIMEJ/kyG/06AUEO5HhIekBIm2OlNyequXX5lB8TLkPEJUj0WqlDXsyotw+BYgOGCpL/o4ePYFQ1FLcXgBEib47XAKRoPU6k/iE9cjBwc3FbZDfXh5TyHrDe4TvYH9PIL9T8emBoDIcuJGjOxBJozf6sqH/NQe+KxDOI2I37zR2DS1Oxtu+kmzk3d/1YYDvsENJEVmMYqYO88to+fUguOsjj1F9ryn/juQ36kC8ahAAGx2IESXKIUAAZFSiKM5qpfFQIAAiiR+KRoYSvqaMR504Ya8iJ3yeqIwfJF1AaIXS3x1d6AvVS93H3omdmzN5sdq7OhaCONS02asuBvVqPvQAK6Xdaz74w4Wk5xVAS5u0h/FaEzbIS0Rmsh3kWUHWJpvFPS0sXFvN9dkGHeuAEia4B0e1TAvtK5omUaKJCDO7qmGpic0kbo0170SKrNo4CYmHDZy92sTW2kqm65IvHkTxawWB0V0eRvDAoZIfEHTg+Zzt9Ky9egMMb4oOFWaeicXKYe0FJfGIgtHGBwztyYh3JiXpwRszqltsgAmK29krwRqQPGf4DksoWq9QQ40IJUoexmRO5J4oBcL/UaTBBtKMZxAEtDwKkH7XolskEgsLo1dsc1RuAaJzBgD5zy3YDPprBi1PnLR7+5QcxJlRfLvcCsSXCXjOA2JT/6MayuucLbxOf8D/qMY3zmGYdTezXAvEA8KbeA8DawaAYRlWNwPQhq1AvOF4W55GNuV9P0cs6Ydn+jlUjQNG//Mf/jcXnWbBbwoAAAAASUVORK5CYII=";
const maisIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADYklEQVRoQ+2aj5ENQRDGv4vAZYAIEAEiQASIABEgAjJABIgAEbiL4MiACKhf1XRV776dnX9t3du6rrp67+p2Z/rr/vrP9NyJdiInO8GhKyAZTz6QdFvSPUmn6bt/9EzSL0lfJfH9cxQjIjyC0o8lPelU6r2kDwlc5xIaotZDSW8k3XC7f3PW/pGs7pXDWzzPJ+/fcn/k+ReSPvWg6fEIirxL9GHPn5LeJgVQpkVYC0DPJV1PL0K7p5Ka1moFAn3wAvz/nRSAGhHC2hjkWoojwFR7pwUIALAcAqf5TuBGCgbCMCQN5JWk1zUb1AKBShbMWCrKCzkd2Ys9EfZiz1WpAYK7nyUqwWc4vIWwFyCgGl7BO1kpAfGWub8hCFMYMB/TL4/WYmYNCBnlewrsLehUohnxeCeXzdaAfEkplsDuLXZRFIRiFF1oDTMOJAfEXEqKxTMj2elP2rVE4zXQZDPqCvGySLHc4hcJQASlIoAA0uKVHg2KTWQJCL0TtKJi+/ajlyZRQNgfr9ABHCSeJSDGR/oeUu+oRAKhCFOYD+J2CYhtfLO138kgjgQCQ6A9MtF9DsSCnC4WikVIJBD0IUbomif0mgOher6sqaQNCKOBLOo4B0KevptLcQ3K+0ejgSyyZg6ESs6hh/SGCyMkGgj6oeckDc+BRG+KITZZcwSIKRjhNb9GTQdwYJwrIA1u+C/Ushx9DMF+7udmu02/x1AQ7eg9Of4eY4titW61RfF5/6ibRoDspo23gxWHGLwyKpHp106uVQcrfxK7jEfdSdo1K5eGDwwd8MplGD7gDYYQTcMHgFpLXzWyHOVf4X2GdLTv2QNfaUBHpWcEE0GxXqw2PWE0RQu/eN1Q6jSrR5a9Whbeq96/BIR9rJISJ013FoPgAMFEnrgYHmKbLlZb+H0LmvnhedXItsYjBsb6MCuazL1GstmSw7A+XsAbSNETpfSbY4W/swAEAzMsFiEMqaGxXevhlX9y9WbKMiSDakxbrHiiAHfmTReYaSTLNRsGsfEsKRYQTWu1UGtudbwDALuN5e+ka6zIJ7Pj+SSG9Mnzdj3NpwkVG/pWe8ErNALE1qE3w4JQo0egJh4eutKLAOKVB5T9wHX/DwE8h9XtXzhQfEj5aI/0eCH8nWiPhCtYu+BugPwFU2XWM4QuDsEAAAAASUVORK5CYII=";

export default class ReservarVagas extends Component {

	constructor(props) {
	  super(props);
	  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  this.state = {
	  	latitude: '',
	  	longitude: '',
	  	loading: false,
	  	selectedTab: 'reservaVagas',
	  	estacionamentos: ds.cloneWithRows([])
	  };
	}

	procurarEstacionamentosProximos() {
		let context = this;
		Meteor.call('buscarEstacionamentosProximidadeApp', this.state.latitude, this.state.longitude, function (error, result) {
			let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			context.setState({estacionamentos: ds.cloneWithRows(result), loading: false});
		});
	}

	cobrarReservaCancelar(reserva) {

	}

	cancelarReserva(reserva) {
		let dtChegadaPrevista = Moment(reserva.dtChegadaPrevista);
		let diff              = dtChegadaPrevista.diff(new Date(), 'minutes');
		if(diff <= 30) {
			Alert.alert(
			  "Atenção",
			  "Faltam menos de 30 min para a sua chegada prevista. Por tanto será cobrado o valor referente a reserva, do momento de efetivação da reserva até o momento atual.",
			  [
			    {text: 'Ok', onPress: () => this.cobrarReservaCancelar(reserva)},
			    {text: 'Cancelar'}
			  ]
			);			
		}
		else {
			Alert.alert(
			  "Atenção",
			  "Deseja realmente cancelar essa reserva?",
			  [
			    {text: 'Sim', onPress: () => Meteor.collection('reservas').remove(reserva.idReserva)},
			    {text: 'Não'}
			  ]
			);
		}
	}

	novaReserva(item) {
		if(Platform.OS === 'ios') {
			this.props.navigator.push({
	          component: NovaReserva,
	          title: 'Nova Reserva',
	          passProps: {
					      estacionamento: item
					    }
	        });
		}
		else {
			this.props.navigator.push({ 
										name: 'novaReserva',
										passProps: {
									      estacionamento: item
									    }
									});
		}
	}

	renderRow(item) {
		return (
			<View style={styles.container}>
				<View style={styles.carContainer}>
					<View style={styles.infoContainer}>
						<Text style={styles.placa}>{item.nome}</Text>
						<Text style={styles.infoCarro}>{item.endereco} - {item.numero} | Fração: R${item.valorFracao}  
																					   | Hora: R${item.valorHora}
																					   | Diária: R${item.valorDiaria}</Text>
					</View>
					<View style={styles.infoContainerRight}>
						<View style={{flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end'}}>
							<TouchableOpacity onPress={()=> this.novaReserva(item)}>
								<Text style={styles.placa}>reservar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		);
	}

	renderBusca() {
		let context = this;
		return (
			<View style={{flex: 1}}> 
		      	<GooglePlacesAutocomplete
			        placeholder='Digite o endereço de onde quer ir'
			        minLength={3} // minimum length of text to search
			        autoFocus={false}
			        fetchDetails={true}
			        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
			          context.setState({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng, loading: true});
			          context.procurarEstacionamentosProximos();
			        }}
			        getDefaultValue={() => {
			          return ''; // text input default value
			        }}
			        query={{
			          // available options: https://developers.google.com/places/web-service/autocomplete
			          key: 'AIzaSyC-CduUc5b9CZFOWaBp5Ys4sbhLk6FeVWE',
			          language: 'pt-br', // language of the results
			          types: 'address', // default: 'geocode'
			        }}
			        styles={{
			          description: {
			            fontWeight: 'bold',
			          },
			          predefinedPlacesDescription: {
			            color: '#1faadb',
			          },
			        }}

			        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
			        GoogleReverseGeocodingQuery={{
			          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
			        }}
			        GooglePlacesSearchQuery={{
			          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
			          rankby: 'distance',
			        }}
			        enablePoweredByContainer={false}
			        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3', 'sublocality', 'administrative_area_level_2', 'administrative_area_level_1']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

			      />

			      <View style={{flex: 1}}>
			      	<ListView dataSource={this.state.estacionamentos} renderRow={this.renderRow.bind(this)}/>
			      </View>
		    </View>
		);
	}

	renderItem(item) {
		if(item) {
			let dt = Moment(item.dtChegadaPrevista).format('DD/MM/YYYY HH:mm');
			return (
				<View style={styles.container}>
					<View style={styles.carContainer}>
						<View style={styles.infoContainer}>
							<Text style={styles.placa}>{item.estacionamento}</Text>
							<Text style={styles.infoCarro}>{item.endereco} {item.numero}</Text>
							<Text style={styles.infoCarro}>Placa: {item.placa}</Text>
							<Text style={styles.chegadaPrevista}>Chegada prevista: {dt}</Text>
						</View>
						<View style={styles.infoContainerRight}>
							<View style={{flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end'}}>
								<TouchableOpacity onPress={()=> this.cancelarReserva(item)}>
									<Text style={styles.cancelar}>cancelar</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			);	
		}
		return null;
	}

	getElements() {
		const { reservas } = this.props;
		let result = [];
		for (var i = 0; i < reservas.length; i++) {
			let reserva = reservas[i];
			let reservaResult = {
				idReserva: reserva._id,
				dtEfetuada: reserva.dtEfetuada,
				dtChegadaPrevista: reserva.dtChegadaPrevista,
				placa: reserva.placa,
				numero: reserva.numero,
				estacionamento: Meteor.collection('estacionamentos').findOne({_id: reserva.estacionamentoId}).nome,
				endereco: Meteor.collection('estacionamentos').findOne({_id: reserva.estacionamentoId}).endereco
			};
			result.push(reservaResult);
		}

		return result;
	}

	renderReservas() {
		const { reservas, ready } = this.props;
		if(ready) {
			if(!reservas || reservas.length == 0) {
				return(
					<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}> 
						<Text>Você não possui nenhuma reserva.</Text>
					</View>
				);
			}
			else {
				return(
					<View style={{flex: 1}}> 
						<MeteorComplexListView
						  elements={this.getElements.bind(this)}
						  renderRow={this.renderItem.bind(this)}
						/>
					</View>
				);
			}
		}
		else {
			return <Loading />
		}
	}

	render() {

		if(this.state.loading) {
			return <Loading />
		}
		else if(Platform.OS === 'ios'){
		    return (
		    	  <TabBarIOS
			        unselectedTintColor="yellow"
			        tintColor="white"
			        barTintColor="darkslateblue">
			        <TabBarIOS.Item
			          title="Reserva de vagas"
			          icon={{uri: maisIcon, scale: 3}}
			          selected={this.state.selectedTab === 'reservaVagas'}
			          onPress={() => {
			            this.setState({
			              selectedTab: 'reservaVagas',
			            });
			          }}>
			          {this.renderBusca()}
			        </TabBarIOS.Item>

			        <TabBarIOS.Item
			          title="Minhas reservas"
			          icon={{uri: historyIcon, scale: 3}}
			          selected={this.state.selectedTab === 'minhasReservas'}
			          onPress={() => {
			            this.setState({
			              selectedTab: 'minhasReservas',
			            });
			          }}>
			          {this.renderReservas()}
			        </TabBarIOS.Item>
			      </TabBarIOS>
			    );
		}
		else {
			return(
				<TabNavigator>
				  <TabNavigator.Item
				    selected={this.state.selectedTab === 'reservaVagas'}
				    title="Reserva de vagas"
				    renderIcon={() => <Image source={require('../../resources/img/history.png')} />}
    				renderSelectedIcon={() => <Image source={require('../../resources/img/history.png')} />}
				    onPress={() => this.setState({ selectedTab: 'reservaVagas' })}>
				    {this.renderBusca()}
				  </TabNavigator.Item>
				  <TabNavigator.Item
				    selected={this.state.selectedTab === 'minhasReservas'}
				    title="Minhas reservas"
				    renderIcon={() => <Image source={require('../../resources/img/plus.png')} />}
    				renderSelectedIcon={() => <Image source={require('../../resources/img/plus.png')} />}
				    onPress={() => this.setState({ selectedTab: 'minhasReservas' })}>
				    {this.renderReservas()}
				  </TabNavigator.Item>
				</TabNavigator>
			);
		}
	}
}

export default createContainer(params=>{
  const handle  = Meteor.subscribe('reservas');
  const handle2 = Meteor.subscribe('estacionamentosApp');

  return {
    ready: handle.ready() && handle2.ready(),
    reservas: Meteor.collection('reservas').find({userId: Meteor.userId(), dtEfetuada: {$ne: null}})
  };
}, ReservarVagas)

const styles = StyleSheet.create({
  container: {
  	borderBottomWidth: 1,
  	flex: 1
  },
  infoContainer: {
	flexDirection: 'column',
	flex: 1
  },
  infoContainerRight: {
  	flex: 1,
  	flexDirection: 'column',
  	alignItems: 'flex-end',
  	marginRight: 20
  },
  carContainer: {
  	flexDirection: 'row',
	paddingBottom: 10,
	left: 10
  },
  placa: {
  	fontWeight: 'bold',
  	fontSize: 24,
  	marginBottom: 10
  },
  cancelar: {
  	fontWeight: 'bold',
  	fontSize: 24,
  	color: 'red'
  },
  infoCarro: {
  	fontSize: 10
  },
  chegadaPrevista: {
  	fontSize: 10,
  	fontWeight: 'bold',
  	textDecorationLine: 'underline'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  acoes: {
  	flexDirection: 'row',
  }
});