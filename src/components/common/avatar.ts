export type AvatarData = {
  text: string;
  yesText?: string;
  noText?: string;
  onYes: () => void;
  onNo?: () => void;
};
