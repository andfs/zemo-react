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

class ParkoActionSheetLiberarIOS extends Component {

	buttonClicked(buttonIndex) {
		if(buttonIndex == 5) {
			this.setState({show:false});
		}
		else {
			this.props.home.liberarVaga(buttonIndex);
		}
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

class ParkoActionSheetLiberarAndroid extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	show: false
	  };
	}

	showActionSheet() {
	    this.setState({show: true});
	}

	onCancel() {
		this.props.home.setState({showControls:true, procurarVaga: true, abaSelecionada: 1});
       	this.setState({show:false});
    }

    showActionSheetLiberar() {
	    this.setState({show: true});
	}

	vagaLivre() {
		this.setState({show: false});
		this.props.home.liberarVaga(0);
	}

	faixaAzul() {
		this.setState({show: false});
		this.props.home.liberarVaga(1);
	}

	faixaVermelha() {
		this.setState({show: false});
		this.props.home.liberarVaga(2);
	}

	piscaAlerta() {
		this.setState({show: false});
		this.props.home.liberarVaga(3);
	}

	idoso() {
		this.setState({show: false});
		this.props.home.liberarVaga(4);
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

const ParkoActionSheetLiberar = Platform.OS === 'ios' ? ParkoActionSheetLiberarIOS : ParkoActionSheetLiberarAndroid;
module.exports = ParkoActionSheetLiberar;