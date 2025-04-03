import z from 'zod';

export const loginSchema = z.object({
  userName: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export type ILoginSchemaSchema = z.infer<typeof loginSchema>;

export class LoginDto {
  constructor(props: ILoginSchemaSchema) {
    Object.assign(this, props);
  }

  userName: string;
  password: string;
}
