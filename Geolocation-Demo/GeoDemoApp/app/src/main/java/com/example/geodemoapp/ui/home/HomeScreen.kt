// HomeScreen.kt

package com.example.geodemoapp.ui.home

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController

@Composable
fun HomeScreen(navController: NavHostController) {

    // Creating a Box to center everything
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        // A Column to stack the title and buttons
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Title
            Text(
                text = "Welcome to Our App",
                style = MaterialTheme.typography.headlineMedium
            )

            // Box to hold the buttons
            Box(
                modifier = Modifier
                    .padding(24.dp)
                    .fillMaxWidth()
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Button(
                        onClick = { navController.navigate("login") }
                    ) {
                        Text(text = "Login")
                    }
                    Button(
                        onClick = { navController.navigate("register") }
                    ) {
                        Text(text = "Register")
                    }
                }
            }
        }
    }

}
