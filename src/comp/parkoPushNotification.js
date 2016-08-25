import React, { Component } from 'react';
import { 
	View, 
	TouchableHighlight,
	Text,
	AppState,
  	Modal
} from 'react-native';

import FCM from 'react-native-fcm';

export default class ParkoPushNotification extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	state: '',
	  	mostrarModal: false
	  };
	}

	componentDidMount() {
		AppState.addEventListener('change', this.handleAppStateChange.bind(this));
		let context = this;
		FCM.requestPermissions(); // for iOS
	    FCM.getFCMToken().then(token => {
	      console.log(token)
	      // store fcm token in your server
	    });
	    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
	      
		    if(context.state.state === 'active' || context.state.state === '') {
		      	this.setState({mostrarModal: true});
		    }

	    });
	    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
	      console.log(token)
	      // fcm token may not be available on first load, catch it here
	    });
	}

	handleAppStateChange(appState) {
		this.setState({state: appState});
	}
	
	componentWillUnmount() {
	    // prevent leaking
	    this.refreshUnsubscribe();
	    this.notificationUnsubscribe();
	    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
	}

	render() {
		return (
		        <Modal
		          animationType={"slide"}
		          transparent={false}
		          visible={this.state.mostrarModal}
		          onRequestClose={() => {alert("Modal has been closed.")}}
		          >
		         <View style={{marginTop: 22}}>
		          <View>
		            <Text>Hello World!</Text>

		            <TouchableHighlight onPress={() => {
		              this.setState({mostrarModal: !this.state.mostrarModal})
		            }}>
		              <Text>Hide Modal</Text>
		            </TouchableHighlight>

		          </View>
		         </View>
		        </Modal>
		);
	}
}