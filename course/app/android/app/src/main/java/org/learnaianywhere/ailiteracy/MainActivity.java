package org.learnaianywhere.ailiteracy;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CoursePackPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
