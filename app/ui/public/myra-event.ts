// A page-wide event that asks every Myra on screen to move, so an island elsewhere, such as the slash demo, can make
// her hop without knowing where she is. A Myra that moves sets hopped, so the sender knows whether anyone did.
export const myraEvent = 'fenmyr:myra'

export type MyraMove = 'hop'

export class MyraMoveEvent extends Event {
  hopped = false

  constructor(readonly move: MyraMove) {
    super(myraEvent)
  }
}
