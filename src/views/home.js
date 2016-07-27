'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert
} from 'react-native';

import MapView from 'react-native-maps';
import SegmentedControl from '../comp/segmentedControl';
import ParkoActionSheetEstacionar from '../comp/actionSheetEstacionar';
import ParkoActionSheetLiberar from '../comp/actionSheetLiberar';
import Meteor from 'react-native-meteor';

export default class Home extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	tipoVaga: null,
	  	flanelinha: null,
	  	showControls: true,
	  	abaSelecionada: 0,
	  	procurarVaga: true,
	  	markersVagas: [],
	  	markersEstacionamentos: [],
	  	dtUltimoCarregamento: '',
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

	estacionar(flanelinha) {
		this.setState({showControls: true, flanelinha: flanelinha});
		Meteor.call('estacionar', this.state.carPosition, flanelinha, function (error, result) {
			if(error) {
		    	alert("Erro ao registrar ação de estacionar.");
		    }
		    else {
		    	Alert.alert(
				  'Parabéns!',
				  result,
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ]
				);
		    }
		});
	}

	liberarVaga(tipoVaga) {
		this.setState({showControls: true, tipoVaga: tipoVaga, abaSelecionada: 0, flanelinha: null});
		Meteor.call('liberarVaga', this.state.carPosition, tipoVaga, function (error, result) {
			if(error) {
		    	alert("Erro ao registrar ação de liberar vaga.");
		    }
		    else {
		    	Alert.alert(
				  'Parabéns!',
				  result,
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ]
				);
		    }
		});
	}

	getBounds(region) {
		let latitudeDelta = region.latitudeDelta ? region.latitudeDelta : this.state.region.latitudeDelta;
		let longitudeDelta = region.longitudeDelta ? region.longitudeDelta : this.state.region.longitudeDelta;
		let northeast = {
	      latitude: region.latitude + latitudeDelta / 2,
	      longitude: region.longitude + longitudeDelta / 2,
	    }
	    , southwest = {
	      latitude: region.latitude - latitudeDelta / 2,
	      longitude: region.longitude - longitudeDelta / 2,
	    }

	    let bounds = {southwest: southwest, northeast: northeast};

	    return bounds;
	}

	carregarVagasEstacionamentos(bounds, region) {
		let context = this;
		Meteor.call('buscarVagas', bounds, function (error, result) {
	    	if(error) {
	    		alert("Erro ao buscar vagas/estacionamentos nas proximidades.");
	    	}
	    	else {
	    		if(region) {
	    			context.setState({
						markersVagas: result.vagas, 
						markersEstacionamentos: result.estacionamentos, 
						region: region,
						dtUltimoCarregamento: new Date()
					});
	    		}
	    		else {
	    			context.setState({
						markersVagas: result.vagas, 
						markersEstacionamentos: result.estacionamentos, 
						dtUltimoCarregamento: new Date()
					});
	    		}
	    	}
	    });
	}

	carregarNovasVagas(currentPosition) {
		if(this.state.ultimaPosicaoCarregamento == '' || this.state.ultimaPosicaoCarregamento == null) {
			return true;
		}
		var R = 6371; // km  
		var dLat = (currentPosition.latitude - this.state.ultimaPosicaoCarregamento.latitude) * Math.PI / 180;  
		var dLon = (currentPosition.longitude - this.state.ultimaPosicaoCarregamento.longitude) * Math.PI / 180;   
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +  
		        Math.cos(this.state.ultimaPosicaoCarregamento.latitude *Math.PI / 180) * 
		        Math.cos(currentPosition.latitude * Math.PI / 180) *   
		        Math.sin(dLon / 2) * Math.sin(dLon / 2);   
		var c = 2 * Math.asin(Math.sqrt(a));   
		var d = R * c;
		d = d * 1000;	//metros

		if(d >= 50) {
			return true
		}
		return false;
	}

	isCarregarNovamente() {
		if( this.state.dtUltimoCarregamento != "" && 
			new Date().getTime() - this.state.dtUltimoCarregamento.getTime() > 7000) 
		{
			
			let bounds = this.getBounds(this.state.ultimaPosicaoCarregamento);
			this.carregarVagasEstacionamentos(bounds);
		}
	}

	componentDidMount() {

		navigator.geolocation.getCurrentPosition(
	      (position) => {
	        let bounds = this.getBounds(position.coords);
			this.carregarVagasEstacionamentos(bounds);
	      },
	      (error) => alert(error.message),
	      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
	    );

		setInterval(this.isCarregarNovamente.bind(this), 7000);
		let context = this;
		navigator.geolocation.watchPosition((currentPosition) => {
			if(this.state.procurarVaga) {
				this.setState({'carPosition.latitude': currentPosition.latitude, 'carPosition.longitude': currentPosition.longitude});
				this.setState({'region.latitude': currentPosition.latitude, 'region.longitude': currentPosition.longitude});
			}
			},
			(error) => alert(JSON.stringify(error)),
		    {enableHighAccuracy: true, timeout: 20000}
		);
	}

	onRegionChangeComplete(region) {

		let carregarNovasVagas = this.carregarNovasVagas(region); 
		if(carregarNovasVagas) {
		    let bounds = this.getBounds(region);
		    this.setState({'ultimaPosicaoCarregamento.latitude': region.latitude, 'ultimaPosicaoCarregamento.longitude': region.longitude});
		    this.carregarVagasEstacionamentos(bounds);
		}
	}

	showActionSheet() {
		this.refs.parkoActionSheet.showActionSheet();
		this.setState({showControls: false});
	}

	showActionSheetLiberar() {
		this.refs.parkoActionSheetLiberar.showActionSheet();
		this.setState({showControls: false});	
	}

	hideActionSheet() {
		this.refs.parkoActionSheet.onCancel();	
		this.setState({showControls: true});
	}
	
	render() {
		return(
				<View style={styles.container}>
				    <MapView style={styles.map}
				      ref="map"
				      region={this.state.region}
				      onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
				    >
				    	<MapView.Marker
						  coordinate={this.state.carPosition}
						  image={require('../../resources/img/car.png')}
						/>

						{this.state.markersVagas.map(marker => (
						    <MapView.Marker
						      key={marker._id}	
						      coordinate={marker.localidade}
						      title={
						      			marker.tipoVaga == 0 ? 'Vaga livre' :
						      			marker.tipoVaga == 1 ? 'Faixa azul' :
						      			marker.tipoVaga == 2 ? 'Faixa vermelha' :
						      			marker.tipoVaga == 3 ? 'Pisca alerta ligado' :
						      			'Idoso/Deficiente'
						  			}
						      description={
						      	marker.flanelinha == 0 ? 'Área com flanelinha registrado' :
						      	marker.flanelinha == 1 ? 'Área com flanelinha NÃO registrado' : ''
						      }
						      pinColor={
						      				marker.tipoVaga == 0 ? 'white' : 
						      				marker.tipoVaga == 1 ? 'blue'  : 
						      				marker.tipoVaga == 2 ? 'red'   :
						      				marker.tipoVaga == 3 ? 'yellow':
						      				'brown'}

			      			  image={
			      			  	marker.flanelinha == 0 || marker.flanelinha == 1 ? 
			      			  		require('../../resources/img/flanelinha.png') : ''
			      			  }
						    />
						))}

						{this.state.markersEstacionamentos.map(marker => (
						    <MapView.Marker
						      key={marker._id}	
						      coordinate={marker.localidade}
						      title={marker.nome}
						      description={
						      				"Valor Fração: R$ " + marker.valorFracao + " - " + 
						      				"Valor Hora: R$ " + marker.valorHora
						      			  }
						      image={require('../../resources/img/parking.png')}
						    />
						))}
				    </MapView>
				    <ParkoActionSheetEstacionar ref="parkoActionSheet" home={this}/>
				    <ParkoActionSheetLiberar ref="parkoActionSheetLiberar" home={this}/>
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