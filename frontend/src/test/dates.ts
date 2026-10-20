/**
 * Returns the viewer's local calendar date `offset` days from today as a
 * `YYYY-MM-DD` string — the same "today" `getDueUrgency` counts from.
 *
 * Don't build these with `new Date(...).toISOString().slice(0, 10)`: that's
 * the UTC date, which in the evening in any US timezone is already
 * tomorrow, so tests built on it fail for a few hours every night.
 */
export function localDateFromToday(offset: number): string {
  const now = new Date();
  // Constructing from local Y/M/D components (rather than adding a fixed
  // millisecond count) keeps the result on the right calendar day across
  // DST changes.
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  const yyyy = target.getFullYear();
  const mm = String(target.getMonth() + 1).padStart(2, "0");
  const dd = String(target.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
