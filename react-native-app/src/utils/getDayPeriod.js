/**
 * Returns 0 if it's morning (5 AM - 5 PM), 1 if it's evening (5 PM - 5 AM)
 */
export default function getDayPeriod() {
  const date = new Date();
  const hours = date.getHours();
  return (hours >= 5 && hours < 17) ? 0 : 1;
}