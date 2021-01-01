function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const m = (month) >= 10 ? month : `0${month}`;
  const day = now.getDate();
  const d = day > 9 ? day : `0${day}`;
  return {year,m,d}
}
export {
  getToday
}