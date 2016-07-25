'use strict';

import React, { Component } from 'react';
import {
  View,
  Platform,
  ActionSheetIOS,
} from 'react-native';

var ActionSheet = require('@remobile/react-native-action-sheet');

var BUTTONS = [
  'Vaga livre',
  'Faixa azul',
  'Faixa vermelha',
  'Pisca alerta ligado',
  'Idoso/Deficiente',
  'Cancelar'
];

var CANCEL_INDEX = 5;


class ParkoActionSheetIOS extends Component {

	buttonClicked(buttonIndex) {
		this.props.home.estacionar(buttonIndex);
	}

	showActionSheet() {
	    ActionSheetIOS.showActionSheetWithOptions({
	      options: BUTTONS,
	      cancelButtonIndex: CANCEL_INDEX
	    },
	    (buttonIndex) => {
	      this.buttonClicked;
	    });
	}
}

class ParkoActionSheetAndroid extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	show: false
	  };
	}

	onCancel() {
       this.setState({show:false});
       if(this.props.home.state.tipoVaga != null) { //ja esta estacionado. Deve liberar a vaga
       		this.props.home.setState({showControls:true});
       }
       else {
       		this.props.home.setState({showControls:true, procurarVaga: true, abaSelecionada: 0});
       }
    }

    showActionSheet() {
	    this.setState({show: true});
	}

	vagaLivre() {
		this.setState({show: false});
		this.props.home.estacionar(0);
	}

	faixaAzul() {
		this.setState({show: false});
		this.props.home.estacionar(1);
	}

	faixaVermelha() {
		this.setState({show: false});
		this.props.home.estacionar(2);
	}

	piscaAlerta() {
		this.setState({show: false});
		this.props.home.estacionar(3);
	}

	idoso() {
		this.setState({show: false});
		this.props.home.estacionar(4);
	}

	


	render() {
		return(
			<ActionSheet
                visible={this.state.show}
                onCancel={this.onCancel.bind(this)} >
                <ActionSheet.Button onPress={this.vagaLivre.bind(this)}>Vaga livre</ActionSheet.Button>
                <ActionSheet.Button onPress={this.faixaAzul.bind(this)}>Faixa azul</ActionSheet.Button>
                <ActionSheet.Button onPress={this.faixaVermelha.bind(this)}>Faixa vermelha</ActionSheet.Button>
                <ActionSheet.Button onPress={this.piscaAlerta.bind(this)}>Pisca alerta ligado</ActionSheet.Button>
                <ActionSheet.Button onPress={this.idoso.bind(this)}>Idoso/Deficiente</ActionSheet.Button>
            </ActionSheet>
		);
	}
}

const ParkoActionSheetEstacionar = Platform.OS === 'ios' ? ParkoActionSheetIOS : ParkoActionSheetAndroid;
module.exports = ParkoActionSheetEstacionar;