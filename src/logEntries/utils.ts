export interface LogEntry {
    id: number,
    entryTimestamp: string,
    entryMessage: string,
    username: string
}

export function formatTimestamp(timestamp: string): string {
  const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).+([+-])(\d{2}):(\d{2})$/;
  const match = timestamp.match(regex);

  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];
    const hour = match[4];
    const minute = match[5];
    const sign = match[6];
    const offsetHour = match[7];
    const offsetMinute = match[8];

    const offsetSign = sign === '+' ? '+' : '-';
    
    return `${year}/${month}/${day} ${hour}:${minute} (UTC${offsetSign}${offsetHour}:${offsetMinute})`;
  } else {
    return 'Failed Parsing Time';
  }
}