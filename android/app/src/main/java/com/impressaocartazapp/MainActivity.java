package com.impressaocartazapp;

import android.app.Activity;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

import java.util.List;

public class MainActivity extends ReactActivity {

    private static Activity activity;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ImpressaoCartazApp";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        activity = this;
    }

    public static Activity getActivity() {
        return activity;
    }

}
