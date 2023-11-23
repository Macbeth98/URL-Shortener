export class TestHelper {
  public testsCount: number;

  public testsDone: number;

  public checkForTearDown: () => Promise<void>;

  constructor(testsCount: number, checkForTearDown: () => Promise<void>) {
    this.testsCount = testsCount;
    this.testsDone = 0;
    this.checkForTearDown = checkForTearDown;
  }

  public async callTearDown() {
    await this.checkForTearDown();
  }

  public async checkForCallTearDown() {
    this.testsDone += 1;
    if (this.testsDone === this.testsCount) {
      await this.callTearDown();
    }
  }
}
