package com.impressaocartazapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.sec.android.ngen.common.lib.ssp.CapabilitiesExceededException;
import com.sec.android.ngen.common.lib.ssp.Result;
import com.sec.android.ngen.common.lib.ssp.job.JobService;
import com.sec.android.ngen.common.lib.ssp.job.JobletAttributes;
import com.sec.android.ngen.common.lib.ssp.printer.PrintAttributes;
import com.sec.android.ngen.common.lib.ssp.printer.PrintAttributesCaps;
import com.sec.android.ngen.common.lib.ssp.printer.PrinterService;
import com.sec.android.ngen.common.lib.ssp.printer.Printlet;
import com.sec.android.ngen.common.lib.ssp.printer.PrintletAttributes;

import java.io.File;
import java.lang.ref.WeakReference;

/**
 * Módulo da SmartUX SDK que é mapeada do Java para o JavaScript.
 *
 * @author Carlos Eduardo Alves de Godoi.
 */
public class SmartUXSDKModule extends ReactContextBaseJavaModule {

    private static final String TAG = "SmartUXSDKModule";

    static final String ACTION_PRINT_COMPLETED = "com.sec.android.ssp.sample.print.ACTION_PRINT_COMPLETED";
    private Activity activity;

    private PrintObserver printObserver;

    SmartUXSDKModule(ReactApplicationContext reactContext) {
        super(reactContext);
        activity = MainActivity.getActivity();

        Log.d(TAG, "activity = " + activity);

        printObserver = new PrintObserver(
            new Handler(reactContext.getMainLooper())
        );
    }

    /**
     * O propósito deste método é retornar o nome String do NativeModule que representa
     * esta classe no JavaScript.
     */
    @Override
    public String getName() {
        return "SmartUXSDKModule";
    }

    /**
     * Em desenvolvimento...
     */
    @ReactMethod
    public void executePrint(String filePath) {
        // Toast.makeText(getReactApplicationContext(), "Baixando arquivo(s) e enviando-o(os) para impressão",
        //         Toast.LENGTH_LONG).show();

        new PrintAsyncTask(getReactApplicationContext()).execute(filePath);
    }

    /**
     * Observer for Print result and progress.
     */
    class PrintObserver extends PrinterService.AbstractPrintletObserver {

        public PrintObserver(Handler handler) {
            super(handler);
        }

        @Override
        public void onProgress(String requestId, Bundle bundle) {
            String keyJobId = Printlet.Keys.KEY_JOBID;

            if (bundle.containsKey(keyJobId)) {
                int jobId = bundle.getInt(keyJobId);

                Log.d(TAG, "onProgress: Recebido jobId " + jobId);
                Toast.makeText(getReactApplicationContext(), "Job ID: " + jobId, Toast.LENGTH_SHORT).show();

                Intent intent = new Intent(getReactApplicationContext(), JobCompleteReceiver.class);

                JobletAttributes taskAttributes = new JobletAttributes.Builder()
                        .setShowUi(true).build();
                String jobRequestId = JobService.monitorJobInForeground(activity,
                        jobId, taskAttributes, intent);

                Log.d(TAG, "Requisição no MonitorJob " + jobRequestId);
            }
        }

        @Override
        public void onComplete(String requestId, Bundle bundle) {
            Log.d(TAG, "Recebido impressão concluída");
            Toast.makeText(getReactApplicationContext(), "Impressão concluída!", Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onFail(String requestId, Result result) {
            Log.d(TAG, "Recebido falha de impressão");
            Toast.makeText(getReactApplicationContext(), "Impressão falhou", Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onCancel(String requestId) {
            Log.d(TAG, "Recebido cancelamento de impressão");
            Toast.makeText(getReactApplicationContext(), "Impressão cancelada", Toast.LENGTH_SHORT).show();
        }
    }

    private static class PrintAsyncTask extends AsyncTask<String, Void, Void> {

        private WeakReference<Context> contextWeakReference;

        PrintAsyncTask(Context context) {
            this.contextWeakReference = new WeakReference<>(context);
        }

        @Override
        protected Void doInBackground(String... strings) {
            Context context = contextWeakReference.get();

            Result result = new Result();
            PrintAttributesCaps caps = PrinterService.getCapabilities(context, result);

            String filePath = strings[0];
            PrintAttributes printAttributes = null;
            try {
                printAttributes = new PrintAttributes.PrintFromStorageBuilder(
                        Uri.fromFile(new File(filePath)))
                    .build(caps);
            } catch (CapabilitiesExceededException e) {
                e.printStackTrace();
            }

            PrintletAttributes taskAttributes = new PrintletAttributes.Builder()
                    .build();

            PrinterService.submit(context, printAttributes, taskAttributes);

            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            super.onPostExecute(aVoid);

            // Toast.makeText(contextWeakReference.get(), "Aguarde o fim da(s) impressão(ões)",
            //         Toast.LENGTH_SHORT).show();
        }

    }

    /**
     * O método imprimir utilizado anteriormente.
     *
     * @param filePath a {@link String} a ser encapsulada como {@link Uri} do arquivo local a ser impresso.
     */
    @ReactMethod
    public void print(String filePath) {
        Uri uri = Uri.parse(filePath);

        Result result = new Result();
        PrintAttributesCaps caps = PrinterService.getCapabilities(getReactApplicationContext(), result);

        PrintAttributes printAttribs = null;
        try {
            printAttribs = new PrintAttributes.PrintFromStorageBuilder(uri)
                    .build(caps);
        } catch (CapabilitiesExceededException e) {
            Log.e(TAG, e.getMessage());

            Toast.makeText(getReactApplicationContext(), e.getMessage(), Toast.LENGTH_LONG).show();
        }

        PrintletAttributes taskAttribs = new PrintletAttributes.Builder()
                .build();

        PrinterService.submit(getReactApplicationContext(), printAttribs, taskAttribs);
    }

}
