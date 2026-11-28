// A page-wide event that asks every Myra on screen to move, so an island elsewhere, such as the slash demo, can
// make her hop without knowing where she is.
export const myraEvent = 'fenmyr:myra'

export type MyraMove = 'hop'

export function moveOf(event: Event): MyraMove | null {
  return event instanceof CustomEvent && event.detail === 'hop' ? 'hop' : null
}
