/*
<ai_context>
Contains the general server action types.
</ai_context>
*/

export type ActionState<T = void> =
  | { isSuccess: true; message: string; data?: T }
  | { isSuccess: false; message: string; data?: never }

export type VoidActionState = ActionState<void>
