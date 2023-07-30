function isDateBetweenLastWeekMondayAndFriday(dateToCheck: Date) {
  const currentDate = new Date();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in one day
  const currentDayOfWeek = currentDate.getDay(); // Get the current day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)

  // Calculate the difference between the current day and last Monday
  const differenceToLastMonday =
    currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const lastMonday = new Date(
    currentDate.getTime() - differenceToLastMonday * oneDayInMilliseconds,
  );

  // Calculate the difference between the current day and last Friday
  const differenceToLastFriday =
    currentDayOfWeek === 0 ? 2 : 6 - currentDayOfWeek;
  const lastFriday = new Date(
    currentDate.getTime() - differenceToLastFriday * oneDayInMilliseconds,
  );

  // Check if the date to check falls between last Monday and last Friday
  return dateToCheck >= lastMonday && dateToCheck <= lastFriday;
}

// Usage example:
// const dateToCheck = new Date('2023-07-19'); // Replace this with the date you want to check
// const result = isDateBetweenLastWeekMondayAndFriday(dateToCheck);
// console.log(result); // Will return true if the date is between last week's Monday and Friday, otherwise false
export { isDateBetweenLastWeekMondayAndFriday };
