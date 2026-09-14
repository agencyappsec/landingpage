/**
 * Remembers, in this browser, that a call was booked — so the fit form offers
 * the calendar once rather than letting the same person fill a week of slots.
 *
 * This is a speed bump, not a lock: clearing site data or switching browsers
 * gets round it. The hard limit belongs in Cal.com itself (a cap on upcoming
 * bookings per booker, plus booker email verification), which is enforced on
 * their side no matter how the booking page is reached.
 */
const BOOKED_AT_KEY = "agencyappsec:booked-at";
const BOOKING_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

export function hasRecentBooking(): boolean {
  try {
    const bookedAt = Number(localStorage.getItem(BOOKED_AT_KEY));
    return bookedAt > 0 && Date.now() - bookedAt < BOOKING_COOLDOWN_MS;
  } catch {
    // Storage blocked (private mode, disabled site data): nothing to go on.
    return false;
  }
}

export function rememberBooking(): void {
  try {
    localStorage.setItem(BOOKED_AT_KEY, String(Date.now()));
  } catch {
    // Same as above — the Cal.com-side limit still applies.
  }
}
