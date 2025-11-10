export const newMessageTemplate = ({
  studentName,
  link,
}: {
  studentName?: string | null;
  link: string;
}) => `Day 1 spelling task 

${link}


Click start game and proceed. 
Please notify me after completion. 


🔥 Enjoy ${studentName ? studentName : ''}
`;

export const followUpMessageTemplate = ({
  studentName,
  link,
}: {
  studentName?: string | null;
  link: string;
}) => `Hello,

This is a gentle reminder to complete the spelling task for today.

${link}

In case you face any issues, please feel free to reach out.

Thank you!

Best regards,
${studentName ? studentName : ''}
`;

export const appreciationMessageTemplate = ({
  studentName,
  numberOfDays,
}: {
  studentName?: string | null;
  numberOfDays: number;
}) => `Super ${studentName ? studentName : ''}!

${'🎯'.repeat(numberOfDays)}
`;
