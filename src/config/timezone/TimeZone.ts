import { toZonedTime, format } from "date-fns-tz";

class TimeZoneConfig {

  static timeZone(created_at: Date) {

    // converte created_at para GMT-3
    const timeZone = 'America/Sao_Paulo';
    const createdAtZoned = toZonedTime(created_at, timeZone);
    return format(createdAtZoned, "dd-MM-yyyy HH:mm:ss", { timeZone })
  }
}

export { TimeZoneConfig };