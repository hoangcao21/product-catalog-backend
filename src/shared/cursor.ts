import { ObjectType } from 'dynamoose/dist/General';

export const CursorUtils = {
  toBase64(value: ObjectType): string {
    const jsonString: string = JSON.stringify(value);

    return Buffer.from(jsonString).toString('base64');
  },
  toObject(stringInBase64: string): ObjectType {
    const asciiString: string = Buffer.from(stringInBase64, 'base64').toString(
      'ascii',
    );

    return JSON.parse(asciiString);
  },
};
