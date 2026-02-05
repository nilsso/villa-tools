import * as v from 'valibot';

export const LoginSchema = v.object({
	email: v.pipe(v.string(), v.email('Enter a valid email.')),
	password: v.pipe(v.string()),
});
