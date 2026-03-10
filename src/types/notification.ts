export interface NotificationApplication {
  id: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  type: 'ALERTE' | 'INFO' | 'SUCCES';
}
