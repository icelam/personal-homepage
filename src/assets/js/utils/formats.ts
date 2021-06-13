export const zeroPad = (n: number): string => (
  n < 10
    ? `0${n}`
    : `${n}`
);

export const getFormattedTime = (date: Date): string => {
  const currentDate = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentHour = date.getHours();
  const currentMinutes = date.getMinutes();

  const currentAMPM = currentHour >= 12 ? 'PM' : 'AM';

  // Format 0 hour to 12 am
  const formattedHour = currentHour % 12 ? currentHour % 12 : 12;

  return `${zeroPad(currentDate)}/${zeroPad(currentMonth)} ${zeroPad(formattedHour)}:${zeroPad(currentMinutes)}${currentAMPM}`;
};
