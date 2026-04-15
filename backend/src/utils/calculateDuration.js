export const calculateDurationHours = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour + startMinute / 60;
  const end = endHour + endMinute / 60;
  return Math.max(end - start, 1);
};
