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

	    }
	}
}

const ParkoNavigator = Platform.OS === 'ios' ? ParkoNavigatorIOS : ParkoNavigatorAndroid;
module.exports = ParkoNavigator;