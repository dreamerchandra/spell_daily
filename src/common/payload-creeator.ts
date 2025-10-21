export type ActionPayload<
  Type extends string,
  Action = undefined,
> = Action extends undefined ? { type: Type } : { type: Type; action: Action };
