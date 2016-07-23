 'use strict'

import {
  StyleSheet,
  Platform
} from 'react-native';

 var stylesIos = StyleSheet.create({
  drawer: {
    flex: 1,
    top:65,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  name: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  loginText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});

  var stylesAndroid = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  name: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  loginText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});

const estiloMenu = Platform.OS === 'ios' ? stylesIos : stylesAndroid;
module.exports = estiloMenu;