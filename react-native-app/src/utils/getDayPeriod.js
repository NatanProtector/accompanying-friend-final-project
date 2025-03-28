/**
 * Returns 0 if it's morning (5 AM - 12 PM), 
 * 1 if it's afternoon (12 PM - 5 PM), 
 * 2 if it's evening (5 PM - 5 AM)
 */
export default function getDayPeriod() {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return 0; // Morning
  } else if (hours >= 12 && hours < 17) {
    return 1; // Afternoon
  } else {
    return 2; // Evening
  }
}
