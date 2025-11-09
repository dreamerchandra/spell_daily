export type User = {
  name: string;
  parentName: string;
  testCode: string;
  lastCompletedDate: Date;
  phoneNumber: string;
  status: 'PAID' | 'FREE_TRIAL' | 'DICTATION';
  userAdmin: string;
};
