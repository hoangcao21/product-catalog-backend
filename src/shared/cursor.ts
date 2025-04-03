import { ObjectType } from 'dynamoose/dist/General';

export type DynamooseCursor = ObjectType;

export const CursorUtils = {
  toBase64(value: DynamooseCursor): string {
    if (!value) {
      return undefined;
    }

    const jsonString: string = JSON.stringify(value);

    return Buffer.from(jsonString).toString('base64');
  },
  toCursorObject(stringInBase64: string): DynamooseCursor {
    if (!stringInBase64) {
      return undefined; // First page
    }

    const asciiString: string = Buffer.from(stringInBase64, 'base64').toString(
      'ascii',
    );

    return JSON.parse(asciiString);
  },
};
