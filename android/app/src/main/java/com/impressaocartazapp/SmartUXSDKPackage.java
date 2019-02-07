package com.impressaocartazapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SmartUXSDKPackage implements ReactPackage {

    /**
     * List of native modules to register with the newly created catalyst instance.
     * @param reactContext The {@link ReactApplicationContext} context.
     * @return The {@link List} of {@link NativeModule} to use in JavaScript.
     */
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new SmartUXSDKModule(reactContext));
    }

    /**
     * @return <code>null</code>
     * @deprecated Deprecated from RN 0.47.
     */
    @Deprecated
    // @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return null;
    }

    /**
     * It is returning an empty list for now.
     *
     * @param reactContext The {@link ReactApplicationContext} context.
     * @return An empty {@link List}.
     */
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

}
