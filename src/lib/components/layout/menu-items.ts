import type { Pathname } from '$app/types';
import { checkUserGroup, type UserGroup } from '$lib/auth';
import type { Nullish } from '$lib/utils';

export type MenuItem = {
	href: Pathname;
	label: string;
	description?: string;
	group?: UserGroup;
};

export type MenuGroup = {
	title: string;
	group?: UserGroup;
} & (
	| {
			href: Pathname;
	  }
	| {
			items: MenuItem[];
	  }
);

export const MENU_GROUPS: MenuGroup[] = [
	{
		title: 'Tools',
		group: 'USER',
		items: [
			{
				href: '/rosters',
				label: 'Rosters',
				description: 'Links to school rosters.',
			},
			{
				href: '/',
				label: 'Inventory',
				description: 'Inventory check-out system.',
			},
		],
	},
	{
		title: 'Admin',
		group: 'ADMIN',
		items: [
			{
				href: '/users',
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
