'use strict';

import React, { Component } from 'react';
import {
  View,
  Platform,
  ActionSheetIOS,
} from 'react-native';

var ActionSheet = require('@remobile/react-native-action-sheet');

var BUTTONS = [
  'Área com flanelinha registrado',
  'Área com flanelinha NÃO registrado',
  'Área SEM flanelinha',
  'Cancelar'
];

var CANCEL_INDEX = 3;

class ParkoActionSheetIOS extends Component {

	buttonClicked(buttonIndex) {
		if(buttonIndex == 3) {
			this.setState({show:false});
	       	if(this.props.home.state.flanelinha != null) { //ja esta estacionado. Deve liberar a vaga
	       		this.props.home.setState({showControls:true});
	       	}
	       	else {
	       		this.props.home.setState({showControls:true, procurarVaga: true, abaSelecionada: 0});
	       	}
		}
		else {
			this.props.home.estacionar(buttonIndex);
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

class ParkoActionSheetAndroid extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	show: false
	  };
	}

	onCancel() {
       this.setState({show:false});
       if(this.props.home.state.flanelinha != null) { //ja esta estacionado. Deve liberar a vaga
       		this.props.home.setState({showControls:true});
       }
       else {
       		this.props.home.setState({showControls:true, procurarVaga: true, abaSelecionada: 0, flanelinha: null});
       }
    }

    showActionSheet() {
	    this.setState({show: true});
	}

	flanelinhaRegistrado() {
		this.setState({show: false});
		this.props.home.estacionar(0);
	}

	flanelinhaNaoRegistrado() {
		this.setState({show: false});
		this.props.home.estacionar(1);
	}

	semFlanelinha() {
		this.setState({show: false});
		this.props.home.estacionar(2);
	}

	render() {
		return(
			<ActionSheet
                visible={this.state.show}
                onCancel={this.onCancel.bind(this)} >
                <ActionSheet.Button onPress={this.flanelinhaRegistrado.bind(this)}>Área com flanelinha registrado</ActionSheet.Button>
                <ActionSheet.Button onPress={this.flanelinhaNaoRegistrado.bind(this)}>Área com flanelinha NÃO registrado</ActionSheet.Button>
                <ActionSheet.Button onPress={this.semFlanelinha.bind(this)}>Área SEM flanelinha</ActionSheet.Button>
            </ActionSheet>
		);
	}
}

const ParkoActionSheetEstacionar = Platform.OS === 'ios' ? ParkoActionSheetIOS : ParkoActionSheetAndroid;
module.exports = ParkoActionSheetEstacionar;