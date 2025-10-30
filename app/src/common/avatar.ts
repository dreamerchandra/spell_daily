export type AvatarData = {
  text: string;
  yesText?: string;
  noText?: string;
  onYes?: () => void;
  onNo?: () => void;
};

export type AvatarCharacterPath = `by_rating/${'0' | '1' | '2' | '3' | '4'}`;
