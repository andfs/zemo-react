'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  NavigatorIOS,
  Platform,
  BackAndroid,
} from 'react-native';
import DrawerView from './views/drawerView';
import Home from './views/home';
import MenuView from './views/menuView';
import MinhasPlacas from './views/minhasPlacas';
import NovaPlaca from './views/novaPlaca';
import ReservarVagas from './views/reservarVaga';
import NovaReserva from './views/novaReserva';
import MeusPontos from './views/meusPontos';
import CartoesCredito from './views/cartoesCredito';
import Pagar from './views/pagar';

class ParkoNavigatorIOS extends Component {

	openMenu() {
		console.log('entrou no metodo openMenu');
		this.refs.nav.push({
	      component: MenuView,
	      title: 'Menu'
	    });
	}

	render() {
		return(
			<NavigatorIOS
				ref='nav'
		        initialRoute={{
		          component: Home,
		          title: 'PARKO',
		          rightButtonTitle: 'Menu',
		          onRightButtonPress: () => this.openMenu(),

		        }}
		        style={{flex: 1}}
		      />
		);
	}
}

class ParkoNavigatorAndroid extends Component {

	render() {
		return(
			<Navigator
				ref="navigator"
		        initialRoute={{ name: 'home'}}
		        renderScene={this.renderScene}
		        style={{flex: 1}}
		      />
		)
	}

	renderScene(route, navigator){
	    switch(route.name) {
	      case 'home' :
	      	return (
	          <DrawerView navigator={navigator} route={route}>
	            <Home navigator={navigator} route={route}/>
	          </DrawerView>
	        );

	      case 'minhasPlacas' :
	      	return (
	          <DrawerView navigator={navigator} route={route}>
	            <MinhasPlacas navigator={navigator} route={route}/>
	          </DrawerView>
	        );

	      case 'novaPlaca':
	      	return (
	          <DrawerView navigator={navigator} route={route}>
	            <NovaPlaca navigator={navigator} route={route}/>
	          </DrawerView>
	        );

	        case 'reservarVagas':
		      	return (
		          <DrawerView navigator={navigator} route={route}>
		            <ReservarVagas navigator={navigator} route={route}/>
		          </DrawerView>
		        );

		    case 'novaReserva':
		      	return (
		          <DrawerView navigator={navigator} route={route}>
		            <NovaReserva navigator={navigator} route={route} {...route.passProps}/>
		          </DrawerView>
		        );

		    case 'meusPontos':
		      	return (
		          <DrawerView navigator={navigator} route={route}>
		            <MeusPontos navigator={navigator} route={route}/>
		          </DrawerView>
		        );

		    case 'cartoesCredito':
		      	return (
		          <DrawerView navigator={navigator} route={route}>
		            <CartoesCredito navigator={navigator} route={route}/>
		          </DrawerView>
		        );

		    case 'pagar':
		      	return (
		          <DrawerView navigator={navigator} route={route}>
		            <Pagar navigator={navigator} route={route}/>
		          </DrawerView>
		        );

	    }
	}
}

const ParkoNavigator = Platform.OS === 'ios' ? ParkoNavigatorIOS : ParkoNavigatorAndroid;
module.exports = ParkoNavigator;