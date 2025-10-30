import type { ActionPayload } from '../../common/payload-creeator';
type NewWord = {
  maxHint: number;
};

export type HintState = {
  maxHint: number;
  currentHint: number;
  testMode: boolean;
};

// Define the payloads
type NewWordPayload = ActionPayload<'NEW_WORD', NewWord>;
type TestModePayload = ActionPayload<'TEST_MODE', { enabled: boolean }>;
type UseHintPayload = ActionPayload<'USE_HINT'>;

export type HintAction = NewWordPayload | UseHintPayload | TestModePayload;

export const hintReducer = (
  state: HintState,
  action: HintAction
): HintState => {
  switch (action.type) {
    case 'TEST_MODE':
      return {
        ...state,
        testMode: action.action.enabled,
      };
    case 'NEW_WORD':
      return {
        ...state,
        currentHint: 0,
        maxHint: action.action.maxHint,
      };
    case 'USE_HINT':
      if (state.testMode) {
        return state; // no hint use in test mode
      }
      return {
        ...state,
        currentHint: state.currentHint + 1,
      };
    default:
      return state;
  }
};
