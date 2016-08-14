import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  TouchableHighlight,
  ListView
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import { NativeModules } from 'react-native';
import Loading from '../comp/loading';
import Moment from 'moment';
import convertePlaca from '../functions/funcoesPlacas';

export default class ConfirmarPagamento extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	loading: true
	  };
	}

	render() {
		let placasArray = [];
		let {ready, placas} = this.props;

		if(!ready || this.state.loading) {
			return(<Loading/>);
		}
		else {
			for (var i = 0; i < placas.length; i++) {
				let placa = placas[i];
				placasArray.push(placa.placa);
			}
			let movimentacao = Meteor.collection('movimentacoes').find({
									placa: {$in: placasArray},
									dtSaida: null,
									estacionamentoId: this.props.estacionamentoId
								});

			

			//buscar no meteor o valor a pagar da primeira movimentacao
		}
	}
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('movimentacoesApp');
  const handle2 = Meteor.subscribe('usuariosPlacas');

  return {
    ready: handle.ready() && handle2.ready(),
    placas: Meteor.user().placas
  };
}, ConfirmarPagamento)

const styles = StyleSheet.create({
  
  
});
