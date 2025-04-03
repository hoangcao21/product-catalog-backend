export abstract class BaseBuilder<R extends object> {
  protected result: R;

  getResult: () => R;
}
