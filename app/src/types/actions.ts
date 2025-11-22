export interface ActionResult {
  success: boolean;
  error?: string;
}

export const defaultActionState: ActionResult = { success: false };
