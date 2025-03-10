# **Simple Emergency Navigation Demo**

## **Purpose**

This is a demo app that simulates a basic emergency response system. It demonstrates how users (citizens, security, and admin) interact with each other through navigation features.

- **Citizens** can report an emergency and get directions to a safe location.
- **Security** gets the location of the emergency and navigates to it.
- **Admins** can see the locations of both citizens and security personnel on a map.

## **How It Works**

1. **Citizen View**: The citizen’s current location is detected, and they are shown a route to a safe location (simulated as a static point on the map).
2. **Security View**: Security sees the citizen’s emergency location and gets a route to the emergency.
3. **Admin View**: The admin can see the locations of both citizens and security personnel on the map in real-time.

This app uses **Google Maps API** or **Mapbox API** for map display and route calculation.
Remember to add your mapbox_access_token.xml from the [getting started](https://docs.mapbox.com/android/maps/guides/install/#:~:text=This%20guide%20describes%20the%20steps%20to%20install%20the,or%20log%20into%20a%20free%20account%20on%20Mapbox.) guide
to app/src/main/res/values