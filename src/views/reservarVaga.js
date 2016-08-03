import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ListView
} from 'react-native';

import Meteor, { createContainer, MeteorComplexListView } from 'react-native-meteor';
import Loading from '../comp/loading';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

export default class ReservarVagas extends Component {

	constructor(props) {
	  super(props);
	  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  this.state = {
	  	latitude: '',
	  	longitude: '',
	  	loading: false,
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
							<TouchableOpacity>
								<Text style={styles.placa}>reservar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		);
	}

	render() {

		if(this.state.loading) {
			return <Loading />
		}
		else {
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
	}
}

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
  	fontSize: 28
  },
  infoCarro: {
  	fontSize: 10
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