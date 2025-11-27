import type { GameType } from '../../common/game-type';
import type { ActionPayload } from '../../common/payload-creeator';

type TypingWithoutBox = {
  attempts: {
    backspaces: string[];
    isCorrect: boolean;
    seconds: number;
    speakerClicked: number;
    hintsUsed: number;
    userAnswer: string;
  }[];
};

type TypingWithBox = {
  attempts: {
    backspaces: string[];
    isCorrect: boolean;
    seconds: number;
    speakerClicked: number;
    hintsUsed: number;
    userAnswer: string;
  }[];
};

export type AnalyticsData = {
  gameMode: GameType;
  word: string;
  isCorrect: boolean;
  totalTimeSeconds: number;
  hintsUsed: number;
  meta: TypingWithBox | TypingWithoutBox;
}[];

type NextGameAction = ActionPayload<'NEXT_GAME'>;
type RecordAnalyticsAction = ActionPayload<
  'RECORD_ANALYTICS',
  AnalyticsData[number]
>;

export type AnalyticsAction = NextGameAction | RecordAnalyticsAction;

export const createAnalyticsReducer = (
  state: AnalyticsData,
  action: AnalyticsAction
) => {
  switch (action.type) {
    case 'NEXT_GAME':
      return [...state];
    case 'RECORD_ANALYTICS':
      return [...state, action.action];
    default:
      return state;
  }
};
