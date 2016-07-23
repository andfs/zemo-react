'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  SegmentedControlIOS,
} from 'react-native';

import { SegmentedControls } from 'react-native-radio-buttons'

class SegmentedControlAndroid extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	selectedIndex: props.abaSelecionada
	  };
	}

	onChange(selectedOption, selectedIndex) {
		let index = selectedOption;
		switch(index)
		{
			case 0:
				this.props.home.setState({procurarVaga: true});
				break;

			case 1:
				this.props.home.setState({procurarVaga: false});
				this.props.home.estacionar();
				break;

			case 2:
				this.props.home.setState({procurarVaga: true});
				this.props.home.liberarVaga();
				break;
		}
	}

	render() {
		const options = [" Procurando Vagas ", "    Estacionar    ", "   Liberar Vaga   "];
		return(
			<SegmentedControls
			  options={ options }
			  onSelection={ this.onChange.bind(this) }
			  selectedIndex={ this.state.selectedIndex }
			/>
		);
	}
}

class SegmentedControlIphone extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	selectedIndex: 0
	  };
	}

	onChange(event) {
		let index = event.nativeEvent.selectedSegmentIndex;
	}
	
	render() {
		return (
				<SegmentedControlIOS 
				  values={["Vagas", "Estacionar", "LiberarVaga"]}
				  selectedOption={this.state.selectedIndex}
				  onChange={this.onChange.bind(this)}
				/>
		);
	}
}

const SegmentedControl = Platform.OS === 'ios' ? SegmentedControlIphone : SegmentedControlAndroid;
module.exports = SegmentedControl;