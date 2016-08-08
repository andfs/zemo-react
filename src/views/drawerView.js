'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighLight,
  Navigator,
  ToolbarAndroid,
  Dimensions,
  DrawerLayoutAndroid,
} from 'react-native';

import MenuView from './menuView';
import Loading from '../comp/loading';
import ParkoNavigatorInicial from '../navigatorInicial';

const {height, width} = Dimensions.get('window');

export default class DrawerView extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      menuAberto: false,
      isLoading: false,
      isLogin: false
    };
  }

  handleDrawer() {
    if(this.state.menuAberto) {
      this.refs.drawer.closeDrawer();
      this.setState({menuAberto: true});
    }
    else {
      this.refs.drawer.openDrawer();
      this.setState({menuAberto: false}); 
    }
  }

  render() {
    if(this.state.isLoading) {
      return (
        <Loading/>
      );
    }
    else if(this.state.isLogin) {
      return (
        <ParkoNavigatorInicial/>
      );
    }
    return (
      <View style={{backgroundColor: 'white'}}>
        <ToolbarAndroid
            navIcon={require('../../resources/img/hamburger.png')}
            onIconClicked={this.handleDrawer.bind(this)}
            title='PARKO'
            style={{height: 45, backgroundColor: '#008b8b'}}
          />
        <DrawerLayoutAndroid
          ref={'drawer'}
          drawerWidth={200}
          style={{height: height - 70}}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => <MenuView navigator={this.props.navigator} drawer={this.refs.drawer} pai={this} />} >
            {this.props.children}
        </DrawerLayoutAndroid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
