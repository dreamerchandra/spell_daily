type NewWord = {
  maxHint: number;
};

export type HintState = {
  maxHint: number;
  currentHint: number;
};

export type HintAction = NewWord;

type Payload<Type = string, Action = HintAction> = {
  type: Type;
  action: Action;
};

type NewWordPayload = Payload<'NEW_WORD', NewWord>;
type UseHintPayload = Omit<Payload<'USE_HINT', undefined>, 'action'>;

export type HintPayload = NewWordPayload | UseHintPayload;

export const hintReducer = (
  state: HintState,
  action: HintPayload
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
