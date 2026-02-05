import type { Pathname } from '$app/types';
import { checkUserGroup, type UserGroup } from '$lib/auth';
import type { Nullish } from '$lib/utils';

export type MenuItem = {
	path: Pathname;
	label: string;
	description?: string;
	group?: UserGroup;
	placeholder?: boolean;
};

export type MenuGroup = {
	title: string;
	group?: UserGroup;
} & (
	| {
			path: Pathname;
	  }
	| {
			items: MenuItem[];
	  }
);

export const TOOLS: MenuItem[] = [
	{
		path: '/rosters',
		label: 'Rosters',
		description: 'Links to school rosters.',
	},
	// {
	// 	path: '/inventory',
	// 	label: 'Inventory',
	// 	description: 'Inventory check-out system.',
	// 	placeholder: true,
	// },
];

export const MENU_GROUPS: MenuGroup[] = [
	{
		title: 'Tools',
		group: 'USER',
		items: TOOLS,
	},
	{
		title: 'Admin',
		group: 'ADMIN',
		items: [
			{
				path: '/users',
				label: 'Users',
				description: 'Manage site users.',
			},
		],
	},
];

export function menuGroups(userGroup: Nullish<UserGroup>): MenuGroup[] {
	return MENU_GROUPS.filter((g) => checkUserGroup(userGroup, g.group)).map((g) =>
		'items' in g
			? { ...g, items: g.items?.filter((v) => checkUserGroup(userGroup, v.group)) }
			: { ...g }
	);
}
