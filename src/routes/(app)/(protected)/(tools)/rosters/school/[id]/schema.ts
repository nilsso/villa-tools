import * as v from 'valibot';
import { SeasonEnum } from '$generated/valibot';

export const UpdateSchoolSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty('Name cannot be empty.')),
});

export type UpdateSchoolSchema = v.InferOutput<typeof UpdateSchoolSchema>;

export const RosterDataSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty('Name cannot be empty.')),
	year: v.pipe(v.number(), v.integer('Must be an integer.')),
	season: v.message(SeasonEnum, 'Select a season.'),
	url: v.pipe(v.string(), v.url('Must be a valid URL.')),
});

export const CreateRosterSchema = v.object({
	school_id: v.string(),
	...RosterDataSchema.entries,
});

export type CreateRosterSchema = v.InferOutput<typeof CreateRosterSchema>;

export const UpdateRosterSchema = v.object({
	rosterId: v.string(),
	data: v.partial(RosterDataSchema),
});

export type UpdateRosterSchema = v.InferOutput<typeof UpdateRosterSchema>;

export const DeleteRosterSchema = v.object({
	rosterId: v.string(),
});

export type DeleteRosterSchema = v.InferOutput<typeof DeleteRosterSchema>;
