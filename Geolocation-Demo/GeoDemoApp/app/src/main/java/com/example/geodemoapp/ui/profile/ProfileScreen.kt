package com.example.geodemoapp.ui.profile

import com.example.geodemoapp.utils.LocationHelper
import android.location.Location
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mapbox.geojson.Point
import com.mapbox.maps.extension.compose.MapboxMap
import com.mapbox.maps.extension.compose.animation.viewport.rememberMapViewportState

@Composable
fun ProfileScreen(title: String) {
    val context = LocalContext.current
    val locationHelper = remember { LocationHelper(context) }
    var hasLocationPermission by remember { mutableStateOf(locationHelper.getPermission()) }
    var userLocation by remember { mutableStateOf<Point?>(null) }
    var showMap by remember { mutableStateOf(false) }

    LaunchedEffect(hasLocationPermission) {
        if (hasLocationPermission) {
            locationHelper.getCurrentLocation { location: Location? ->
                location?.let {
                    userLocation = Point.fromLngLat(it.longitude, it.latitude)
                } ?: Toast.makeText(context, "Failed to get location", Toast.LENGTH_SHORT).show()
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Title at the top
        Text(
            text = "$title Map",
            fontSize = 24.sp,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        )

        if (!hasLocationPermission) {
            // Show permission button if permission is not granted
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Button(onClick = {
                    hasLocationPermission = locationHelper.getPermission()
                }) {
                    Text("Grant Location Permission")
                }
            }
        } else if (userLocation != null) {
            Button(
                onClick = { showMap = true },
                modifier = Modifier.align(Alignment.CenterHorizontally).padding(16.dp)
            ) {
                Text("Show Map")
            }

            if (showMap) {
                // Box containing the map
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .fillMaxHeight(0.9f),
                    contentAlignment = Alignment.Center
                ) {
                    MapboxMap(
                        Modifier.fillMaxSize(),
                        mapViewportState = rememberMapViewportState {
                            setCameraOptions {
                                zoom(10.0)
                                center(userLocation!!)
                                pitch(0.0)
                                bearing(0.0)
                            }
                        },
                    )
                }
            }
        }
    }
}
