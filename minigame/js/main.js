import Check from './check'

export default class Main {
  constructor() {
    this.Check()
  }
  async Check(){
    for (let i = 0; i <= 100; i++) {
      await Check.Check({
        content: encodeURIComponent('你真他妈是个小可爱')
      })
    }
  }
}
