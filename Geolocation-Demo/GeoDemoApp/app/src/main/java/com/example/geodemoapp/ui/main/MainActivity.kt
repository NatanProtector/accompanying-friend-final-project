// MainActivity.kt
package com.example.geodemoapp.ui.main

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.example.geodemoapp.ui.theme.GeoDemoAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GeoDemoAppTheme {
                // Calling the HomeScreen composable
                NavigationGraph()
            }
        }
    }
}

@Preview
@Composable
fun PreviewMain() {
    Surface {
        NavigationGraph()
    }
}
