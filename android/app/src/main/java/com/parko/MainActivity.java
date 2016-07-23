package com.parko;

import com.facebook.react.ReactActivity;
import com.airbnb.android.react.maps.MapsPackage;
import android.content.Intent; // import para o login do facebook
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;



public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "parko";
    }

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
	    super.onActivityResult(requestCode, resultCode, data);
	    MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
	}

}
