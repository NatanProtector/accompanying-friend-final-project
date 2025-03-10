package com.example.geodemoapp.data

import androidx.compose.runtime.mutableStateOf

// Language manager singleton, to use across view models
object LanguageManager {
    // Private mutable state to prevent direct access
    private var _language = mutableStateOf("en") // Default language: English

    // Public property to access the language value
    val language get() = _language.value

    // Public method to switch between "en" and "he"
    fun toggleLanguage() {
        _language.value = if (_language.value == "en") "he" else "en"
    }
}
