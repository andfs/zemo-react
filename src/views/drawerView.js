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
  StatusBar,
  DrawerLayoutAndroid,
  Image
} from 'react-native';

import MenuView from './menuView';
import Loading from '../comp/loading';
import ParkoNavigatorInicial from '../navigatorInicial';
import Background from '../comp/background';

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
      <View>
          <Background>
            <ToolbarAndroid
                navIcon={require('../../resources/img/hamburger.png')}
                onIconClicked={this.handleDrawer.bind(this)}
                style={{height: 48, marginTop:20}}
              />
            <DrawerLayoutAndroid
              ref={'drawer'}
              drawerWidth={200}
              style={{height: height - 70}}
              drawerPosition={DrawerLayoutAndroid.positions.Left}
              renderNavigationView={() => <MenuView navigator={this.props.navigator} drawer={this.refs.drawer} pai={this} />} >
                {this.props.children}
            </DrawerLayoutAndroid>
          </Background>
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
  backgroundImage: {
        flex: 1,
        resizeMode: Image.resizeMode.stretch,
        width: null,
        height: null,
    },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
