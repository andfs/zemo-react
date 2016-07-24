'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import MapView from 'react-native-maps';
import SegmentedControl from '../comp/segmentedControl';

export default class Home extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	abaSelecionada: 0,
	  	procurarVaga: true,
	  	markers: [],
	  	ultimaPosicaoCarregamento: {
	  		latitude: -19.907342,
	      	longitude: -43.975907,	
	  	},
	  	carPosition: {
	  		latitude: -19.907342,
	      	longitude: -43.975907,	
	  	},
	  	region: {
	      latitude: -19.907342,
	      longitude: -43.975907,
	      latitudeDelta: 0.0026,
	      longitudeDelta: 0.0026,
	    }
	  };
	}

	estacionar() {

	}

	liberarVaga() {

	}

	carregarNovasVagas(currentPosition) {
		var R = 6371; // km  
		var dLat = (currentPosition.latitude - this.state.ultimaPosicaoCarregamento.latitude) * Math.PI / 180;  
		var dLon = (currentPosition.longitude - this.state.ultimaPosicaoCarregamento.longitude) * Math.PI / 180;   
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +  
		        Math.cos(this.state.ultimaPosicaoCarregamento.latitude *Math.PI / 180) * 
		        Math.cos(currentPosition.latitude * Math.PI / 180) *   
		        Math.sin(dLon / 2) * Math.sin(dLon / 2);   
		var c = 2 * Math.asin(Math.sqrt(a));   
		var d = R * c;
		d = d * 1000;	

		if(d >= 50) {
			return true
		}
		return false;
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition((initialPosition) => {
		        this.setState({'region.latitude': initialPosition.latitude, 'region.longitude': initialPosition.longitude});
		        this.setState({'carPosition.latitude': initialPosition.latitude, 'carPosition.longitude': initialPosition.longitude});
		        this.setState({'ultimaPosicaoCarregamento.latitude': initialPosition.latitude, 'ultimaPosicaoCarregamento.longitude': initialPosition.longitude});
			},
			(error) => alert(JSON.stringify(error)),
		    {enableHighAccuracy: true, timeout: 20000}
		);

		navigator.geolocation.watchPosition((currentPosition) => {
				if(this.state.procurarVaga) {
					this.setState({'carPosition.latitude': currentPosition.latitude, 'carPosition.longitude': currentPosition.longitude});
					this.setState({'region.latitude': currentPosition.latitude, 'region.longitude': currentPosition.longitude});
					this.setState({'ultimaPosicaoCarregamento.latitude': initialPosition.latitude, 'ultimaPosicaoCarregamento.longitude': initialPosition.longitude});
				}
				
			},
			(error) => alert(JSON.stringify(error)),
		    {enableHighAccuracy: true, timeout: 20000}
		);
	}

	onRegionChange(region) {

		let carregarNovasVagas = this.carregarNovasVagas(region); 
		if(carregarNovasVagas) {
			//Buscar  novas vagas/estacionamentos

			let northeast = {
		      latitude: region.latitude + region.latitudeDelta / 2,
		      longitude: region.longitude + region.longitudeDelta / 2,
		    }
		    , southwest = {
		      latitude: region.latitude - region.latitudeDelta / 2,
		      longitude: region.longitude - region.longitudeDelta / 2,
		    }
		}
	}
	
	render() {
		return(
				<View style={styles.container}>
				    <MapView style={styles.map}
				      ref="map"
				      region={this.state.region}
				      onRegionChange={this.onRegionChange.bind(this)}
				    >
				    	<MapView.Marker
						  coordinate={this.state.carPosition}
						  image={require('../../resources/img/car.png')}
						/>

						{this.state.markers.map(marker => (
						    <MapView.Marker
						      coordinate={marker.latlng}
						      title={marker.title}
						      description={marker.description}
						      image={require('../../resources/img/'+ marker.icone)}
						    />
						))}
				    </MapView>

			    	<SegmentedControl abaSelecionada={this.state.abaSelecionada} home={this}/>
				</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: null,
    width: null,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: null,
    width: null,
  },
});