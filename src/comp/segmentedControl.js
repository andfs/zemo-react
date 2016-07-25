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

	onChange(selectedOption, selectedIndex) {
		let index = selectedIndex;
		switch(index)
		{
			case 0:
				this.props.home.setState({procurarVaga: true, abaSelecionada: 0});
				break;

			case 1:
				this.props.home.setState({procurarVaga: false, abaSelecionada: 1});
				this.props.home.showActionSheet();
				break;

			case 2:
				this.props.home.setState({procurarVaga: true, abaSelecionada: 0});
				this.props.home.liberarVaga();
				break;
		}
	}

	render() {
		let options = [];
		if(this.props.abaSelecionada == 1) {
			options = [" Procurando Vagas ", "    Estacionado    ", "   Liberar Vaga   "];
		}
		else {
			options = [" Procurando Vagas ", "    Estacionar    ", "   Liberar Vaga   "];	
		}
		if(this.props.home.state.showControls) {
			return(
				<View>
					<SegmentedControls
					  options={ options }
					  onSelection={ this.onChange.bind(this) }
					  selectedIndex={ this.props.abaSelecionada }
					/>
				</View>
			);
		}
		else {
			return (<View></View>);
		}
	}
}

class SegmentedControlIphone extends Component {

	onChange(event) {
		let index = event.nativeEvent.selectedSegmentIndex;
		switch(index)
		{
			case 0:
				this.props.home.setState({procurarVaga: true, abaSelecionada: 0});
				break;

			case 1:
				this.props.home.setState({procurarVaga: false, abaSelecionada: 1});
				this.props.home.showActionSheet();
				break;

			case 2:
				this.props.home.setState({procurarVaga: true, abaSelecionada: 0});
				this.props.home.liberarVagaActionSheet();
				break;
		}
	}
	
	render() {
		let options = [];
		if(this.props.abaSelecionada == 1) {
			options = [" Procurando Vagas ", "    Estacionado    ", "   Liberar Vaga   "];
		}
		else {
			options = [" Procurando Vagas ", "    Estacionar    ", "   Liberar Vaga   "];	
		}

		if(this.props.home.state.showControls) {
			return (
				<SegmentedControlIOS 
				  values={options}
				  selectedOption={this.state.selectedIndex}
				  onChange={this.onChange.bind(this)}
				/>
			);
		}
		else {
			return (<View></View>);
		}
	}
}

const SegmentedControl = Platform.OS === 'ios' ? SegmentedControlIphone : SegmentedControlAndroid;
module.exports = SegmentedControl;