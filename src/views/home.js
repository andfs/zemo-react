'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  AsyncStorage,
  AppState
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
	  	watchID: null,
	  	tipoVaga: null,
	  	ativo: true,
	  	flanelinha: null,
	  	showControls: true,
	  	abaSelecionada: 0,
	  	procurarVaga: true,
	  	markersVagas: [],
	  	markersFlanelinhas: [],
	  	markersEstacionamentos: [],
	  	dtUltimoCarregamento: '',
	  	ultimaPosicaoCarregamento: {
	  		latitude: null,
	      	longitude: null,	
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
		AsyncStorage.setItem('parkoLocalEstacionamento', JSON.stringify(this.state.carPosition), function(error) {
			if(error) {
				console.log('erro');
			}
		});

		Meteor.call('estacionar', this.state.carPosition, flanelinha, function (error, result) {
			if(error) {
		    	Alert.alert(
				  "Ooops...",
				  "Erro ao registrar a ação de estacionar.",
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ]
				);
		    }
		    else {
		    	Alert.alert(
				  result.titulo,
				  result.texto,
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ]
				);
		    }
		});
	}

	liberarVaga(tipoVaga) {
		this.setState({showControls: true, tipoVaga: tipoVaga, abaSelecionada: 0, flanelinha: null});
		AsyncStorage.removeItem('parkoLocalEstacionamento');
		Meteor.call('liberarVaga', this.state.carPosition, tipoVaga, function (error, result) {
			if(error) {
		    	Alert.alert(
				  "Ooops...",
				  "Erro ao registrar a ação de liberar vaga.",
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ]
				);
		    }
		    else {
		    	Alert.alert(
				  result.titulo,
				  result.texto,
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
	    		Alert.alert(
				  "Ooops...",
				  "Erro ao buscar vagas/estacionamentos nas proximidades.",
				  [
				    {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ]
				);
	    	}
	    	else {
	    		if(region) {
	    			context.setState({
						markersVagas: result.vagas, 
						markersFlanelinhas: result.flanelinhas,
						markersEstacionamentos: result.estacionamentos, 
						region: region,
						ultimaPosicaoCarregamento: region, 
						dtUltimoCarregamento: new Date()
					});
	    		}
	    		else {
	    			context.setState({
						markersVagas: result.vagas,
						markersFlanelinhas: result.flanelinhas,
						markersEstacionamentos: result.estacionamentos, 
						dtUltimoCarregamento: new Date()
					});
	    		}
	    	}
	    });
	}

	carregarNovasVagas(currentPosition) {
		if(this.state.ativo) {
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
		return false;
	}

	isCarregarNovamente() {
		if(this.state.ativo && this.state.dtUltimoCarregamento != "" && 
			new Date().getTime() - this.state.dtUltimoCarregamento.getTime() > 7000) 
		{
			console.log('carregando denovo');
			let bounds = this.getBounds(this.state.ultimaPosicaoCarregamento);
			this.carregarVagasEstacionamentos(bounds);
		}
	}

	handleAppStateChange(appState) {
		if(appState === 'background' || appState === 'inactive') {
			this.setState({ativo: false});
			console.log('background ou inativo');
		}
		else {
			this.setState({ativo: true});
			this.startWatch();
		}
	}

	startWatch() {
		let context = this;
		let watchID = navigator.geolocation.watchPosition((currentPosition) => {
			console.log('posicao mudou');
			if(this.state.procurarVaga) {
				this.setState({'carPosition.latitude': currentPosition.latitude, 'carPosition.longitude': currentPosition.longitude});
				this.setState({'region.latitude': currentPosition.latitude, 'region.longitude': currentPosition.longitude});
			}
			},
			(error) => console.log(error),
		    {enableHighAccuracy: true, timeout: 2000}
		);

		this.setState({watchID: watchID});
	}

	componentWillUnmount() {
    	AppState.removeEventListener('change', this.handleAppStateChange);
    	navigator.geolocation.clearWatch(this.state.watchID);
  	}

	componentDidMount() {
		let context = this;
		AsyncStorage.getItem('parkoLocalEstacionamento', function(error, result) {
			if(!error && result) {
				let localEstacionamento = JSON.parse(result);
				let bounds = context.getBounds(localEstacionamento);
				context.setState({abaSelecionada: 1});
				context.carregarVagasEstacionamentos(bounds);
			}
			else {
				navigator.geolocation.getCurrentPosition(
			      (position) => {
			        let bounds =  context.getBounds(position.coords);
					context.carregarVagasEstacionamentos(bounds);
			      },
			      (error) => console.log(error),
			      {enableHighAccuracy: true, timeout: 2000}
			    );
			}
			
		});
		AppState.addEventListener('change', this.handleAppStateChange.bind(this));

		// setInterval(this.isCarregarNovamente.bind(this), 10000);
		this.startWatch();
	}

	onRegionChangeComplete(region) {
		let carregarNovasVagas = this.carregarNovasVagas(region); 
		if(carregarNovasVagas) {
		    let bounds = this.getBounds(region);
		    this.carregarVagasEstacionamentos(bounds, region);
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
						    />
						))}

						{this.state.markersFlanelinhas.map(marker => (
						    <MapView.Marker
						      key={marker._id}	
						      coordinate={marker.localidade}
						      title={
						      			marker.flanelinha == 0 ? 'Área com flanelinha registrado' :
						      			marker.flanelinha == 1 ? 'Área com flanelinha NÃO registrado' : ''
						  			}
						      image={require('../../resources/img/flanelinha.png')}
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