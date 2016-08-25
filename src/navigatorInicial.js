import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';

import Login from './login';
import Cadastro from './views/cadastro';
import ParkoNavigator from './parkoNavigator';

export default class ParkoNavigatorInicial extends Component {

	render() {
		return(
				<Navigator
					ref="navigator"
			        initialRoute={{ name: 'login'}}
			        renderScene={this.renderScene}
			        style={{flex: 1}}
			      />
		
		)
	}

	renderScene(route, navigator){
	    switch(route.name) {
	      case 'login' :
	        return <Login navigator={navigator} route={route}/>

	      case 'home' :
			return <ParkoNavigator/>	      

		  case 'cadastro' :
			return <Cadastro navigator={navigator} route={route}/> 

	    }
	}
}