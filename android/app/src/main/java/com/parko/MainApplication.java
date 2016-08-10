package com.parko;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.CallbackManager; // import para o login do facebook
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger; 
import com.facebook.FacebookSdk;
import com.airbnb.android.react.maps.MapsPackage;
import java.util.Arrays;
import java.util.List;
import com.zfedoran.react.modules.cardscan.*;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = new CallbackManager.Factory().create();
  private static CardScanPackage mCardScanPackage = new CardScanPackage();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        ReactPackage packages[] = new ReactPackage[]{
            new MainReactPackage(),
            new MapsPackage(),
            new FBSDKPackage(mCallbackManager),
            mCardScanPackage
        };
        return Arrays.<ReactPackage>asList(packages);
    }
  };

  @Override
    public void onCreate() {
      FacebookSdk.sdkInitialize(this);
    }

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  public static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  public static CardScanPackage getCardScanPackage() {
    return mCardScanPackage;
  }
}
