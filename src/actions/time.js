module.exports = () => {
  /**
   * The `Date.now()` method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
   * By using `new Date()`, a Date object is created.
   * The `.toLocaleTimeString()` method then transforms it into the human readable form.
   */
  const now = new Date(Date.now())
  console.log(now.toLocaleTimeString())
}
