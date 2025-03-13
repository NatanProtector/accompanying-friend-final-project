package com.example.geodemoapp.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TopRightButton(onClick: () -> Unit, text: String) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp) // Add some padding from the edges
    ) {
        Button(
            onClick = onClick,
            modifier = Modifier.align(Alignment.TopEnd) // Fix to top-right
        ) {
            Text(text)
        }
    }
}
