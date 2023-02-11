export type EmailStatus = 'SENT' | 'TRASH' | 'INBOX';

export type Email = {
  id: number;
  from: string;
  read: boolean;
  subject: string;
  body: string;
  date: string;
  avatar: string;
  contactName: string;
  status: EmailStatus;
};
