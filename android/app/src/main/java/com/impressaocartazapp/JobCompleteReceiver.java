package com.impressaocartazapp;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

public class JobCompleteReceiver extends BroadcastReceiver {

    private static final String TAG = "JobCompleteReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        ComponentName component = intent.getComponent();

        if (SmartUXSDKModule.ACTION_PRINT_COMPLETED.equals(action)
                && component != null
                && context.getPackageName().equals(component.getPackageName())) {
            Log.d(TAG, "Recebendo intent pendente");
            Toast.makeText(context, "Recebido intent completa", Toast.LENGTH_SHORT).show();
        }
    }

}
