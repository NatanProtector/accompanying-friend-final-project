# TODO
- REMOVE ERROR WHEN EMAIL SENDING FAILS! the amount of emails we can send is limited, and decoupled from the
account creation process, add an error like "Account registered but verification email could not be sent,
 contact support"
- link support email somewhere.
- `DriveScreen.js`: Right now it will only center on the user. Make a center and drag listener to center on the camera without preventing the user from dragging the map.

## Desktop App
- Search through users by email,name, etc, not implemented in desktop app

# BUGS
- `DriveScreen.js`: When the title is too long, it overlaps with the search button.
- Add contact information in case of issues

# Notes before building:
- `app.json` add Maps API to build sections when building the app
- `emailJS.js` enable email sending.