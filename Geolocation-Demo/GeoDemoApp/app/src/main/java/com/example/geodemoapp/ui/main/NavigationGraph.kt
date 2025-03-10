package com.example.geodemoapp.ui.main

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.geodemoapp.ui.components.TopRightButton
import com.example.geodemoapp.ui.login.LoginScreen
import com.example.geodemoapp.ui.home.HomeScreen
import com.example.geodemoapp.ui.login.LoginSelect
import com.example.geodemoapp.ui.profile.CitizenScreen
import com.example.geodemoapp.ui.register.RegisterScreen


@Composable
fun AddBackButtonToScreen(navController: NavHostController, content: @Composable (navController: NavHostController) -> Unit) {
    Box {
        content(navController)
        TopRightButton(
            onClick={ navController.popBackStack() },
            "Back"
        )
    }

}

@Composable
fun NavigationGraph() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(navController) // No back button needed
        }
        composable("login") {
            AddBackButtonToScreen(navController) {
                LoginSelect(navController)
            }
        }
        composable("login_citizen") {
            AddBackButtonToScreen(navController) {
                LoginScreen(navController, "citizen")
            }
        }
        composable("login_security") {
            AddBackButtonToScreen(navController) {
                LoginScreen(navController, "security")
            }
        }
        composable("register") {
            AddBackButtonToScreen(navController) {
                RegisterScreen(navController)
            }
        }
        composable("register_citizen") {
            AddBackButtonToScreen(navController) {
                RegisterScreen(navController)
            }
        }
        composable("register_security") {
            AddBackButtonToScreen(navController) {
                RegisterScreen(navController)
            }
        }
        composable("citizen") {
            CitizenScreen() // No back button needed
        }
    }
}
