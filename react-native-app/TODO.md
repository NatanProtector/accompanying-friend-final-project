# TODO
- REMOVE ERROR WHEN EMAIL SENDING FAILS! the amount of emails we can send is limited, and decoupled from the
account creation process, add an error like "Account registered but verification email could not be sent,
 contact support"
- link support email somewhere.
- Implement screen lock and cancel option when request is pending, or too many requests will crash the app.
- `DriveScreen.js`: Getting location by clicking the map is handled completely differently than getting location by searching for and clicking an address, or by clicking the search button. Standardize this.
- `DriveScreen.js`: Right now it will only center on the user. Make a center and drag listener to center on the camera without preventing the user from dragging the map.

# BUGS

- Security user disconnects from sockets when navigating to the settings screen (maybe okay? to reapply settings?).
- `HomeScreen.js`: Multiple clicks on login at once will cause the app to crash.
- `DriveScreen.js`: When the title is too long, it overlaps with the search button.
- `DriveScreen.js`: Heading and location updates on the map every 5 seconds, which leads to choppy movement.
- `DriveScreen.js`: Many style issues.
- `DriveScreen.js`: The cancel button in the search modal is canceling the ride.
- `DriveScreen.js`: Suggestion: make a single state for `inRide`, and change other states via `useEffect`.
