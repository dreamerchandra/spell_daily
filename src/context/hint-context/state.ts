import type { ActionPayload } from '../../common/payload-creeator';
type NewWord = {
  maxHint: number;
};

export type HintState = {
  maxHint: number;
  currentHint: number;
};

// Define the payloads
type NewWordPayload = ActionPayload<'NEW_WORD', NewWord>;
type UseHintPayload = ActionPayload<'USE_HINT'>;

export type HintAction = NewWordPayload | UseHintPayload;

export const hintReducer = (
  state: HintState,
  action: HintAction
): HintState => {
  switch (action.type) {
    case 'NEW_WORD':
      return {
        currentHint: 0,
        maxHint: action.action.maxHint,
      };
    case 'USE_HINT':
      return {
        ...state,
        currentHint: state.currentHint + 1,
      };
    default:
      return state;
  }
};
