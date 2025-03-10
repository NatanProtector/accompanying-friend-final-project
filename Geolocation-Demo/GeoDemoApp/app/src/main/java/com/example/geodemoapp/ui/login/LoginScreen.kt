package com.example.geodemoapp.ui.login

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController

@Composable
fun LoginScreen(navController: NavHostController, user_type: String) {
    // State to hold email and password
    val email = remember { mutableStateOf("") }
    val password = remember { mutableStateOf("") }

    // State to handle errors (empty fields)
    val emailError = remember { mutableStateOf(false) }
    val passwordError = remember { mutableStateOf(false) }

    // Handle login logic
    fun onLoginClick() {
        // Check if the fields are empty
        emailError.value = email.value.isEmpty()
        passwordError.value = password.value.isEmpty()

        // Navigate to the user_type route if either field is empty
        if (emailError.value || passwordError.value) {
            navController.navigate(user_type) // Navigate to the user_type route
        } else {
            // Handle login logic here (e.g., authentication)
        }
    }

    // Layout for the login screen
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Email TextField
        TextField(
            value = email.value,
            onValueChange = { email.value = it },
            label = { Text("Email") },
            isError = emailError.value,
            modifier = Modifier.fillMaxWidth()
        )

        // Password TextField
        Spacer(modifier = Modifier.height(8.dp))
        TextField(
            value = password.value,
            onValueChange = { password.value = it },
            label = { Text("Password") },
            isError = passwordError.value,
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = PasswordVisualTransformation()
        )

        // Error messages for empty fields
        if (emailError.value) {
            Text(
                text = "Email cannot be empty",
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.align(Alignment.Start)
            )
        }
        if (passwordError.value) {
            Text(
                text = "Password cannot be empty",
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.align(Alignment.Start)
            )
        }

        // Login Button
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = { onLoginClick() },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Login")
        }
    }
}
