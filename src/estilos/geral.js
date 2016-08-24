import React from 'react';
import { StyleSheet } from 'react-native';

const color = {
    light1: '#FBFFED',
    light2: '#EEEFE3',
    dark1: '#002B47',
    dark2: 'rgba(0, 0, 0, 0.40)',
    dark3: 'rgba(0, 0, 0, 0.12)',
    background: '#2C6B94',
};

const stylesGeral = StyleSheet.create({
	title: {
	    fontSize: 25,
	    marginBottom: 15,
	    color: color.light1,
	},
	error: {
		color: 'red',
		fontWeight: 'bold',
		borderBottomWidth: 1,
		textDecorationLine: 'underline',
		marginTop: 5
	},
	titleContainer: {
		alignItems: 'center',
		marginBottom: 30,
	},
	topico: {
		fontWeight: 'bold',
  		color: color.dark2
	},
	respostaTopico: {
  		color: color.light2
	}
});

module.exports = { stylesGeral, color };