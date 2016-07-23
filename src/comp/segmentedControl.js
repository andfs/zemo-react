'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  SegmentedControlIOS,
} from 'react-native';


export default class SegmentedControl extends Component {

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
				<SegmentedControlIOS style={{flex: 1}}
				  values={['Procurando Vagas', 'Estacionar', 'LiberarVaga']}
				  selectedIndex={this.state.selectedIndex}
				  onChange={this.onChange.bind(this)}
				/>
		);
	}
}