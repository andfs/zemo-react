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


class ParkoActionSheetLiberarIOS extends Component {

	buttonClicked(buttonIndex) {
		this.props.home.liberarVaga(buttonIndex);
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

	onCancel() {
       this.setState({show:false});
    }

    showActionSheetLiberar() {
	    this.setState({show: true});
	}

	flanelinhaRegistrado() {
		this.setState({show: false});
		this.props.home.liberarVaga(0);
	}

	flanelinhaNaoRegistrado() {
		this.setState({show: false});
		this.props.home.liberarVaga(1);
	}

	semFlanelinha() {
		this.setState({show: false});
		this.props.home.liberarVaga(2);
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

const ParkoActionSheetLiberar = Platform.OS === 'ios' ? ParkoActionSheetLiberarIOS : ParkoActionSheetLiberarAndroid;
module.exports = ParkoActionSheetLiberar;