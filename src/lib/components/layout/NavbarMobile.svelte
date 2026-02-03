<script lang="ts" module>
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { User } from '$lib/auth';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { cn, markEnds } from '$lib/utils';
	import type { IconProps } from '@lucide/svelte';
	import { HouseIcon, LogOutIcon, MenuIcon, SettingsIcon } from '@lucide/svelte/icons';
	import type { Component } from 'svelte';
	import { menuGroups } from './menu-items';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		user: User | undefined;
		class?: ClassValue;
	};
</script>

<script lang="ts">
	let { user, class: className }: Props = $props();

	let open = $state(false);

	const groups = $derived(menuGroups(user?.group));
	const triggerClass = $derived(cn(buttonVariants({ variant: 'ghost' }), className));
</script>

<Drawer.Root bind:open direction="left">
	<Drawer.Trigger class={triggerClass}>
		<MenuIcon />
		Menu
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="grid gap-4 p-4">
			{@render MobileLink({ href: '/', label: 'Home', icon: HouseIcon })}
			{#if user}
				{@render MobileLink({ href: '/user', label: 'User', icon: SettingsIcon })}
				<form method="POST" action={resolve('/(app)/(public)/logout')}>
					<button type="submit" class="flex items-center gap-2 text-2xl font-medium">
						<LogOutIcon />
						Logout
					</button>
				</form>
			{/if}
			<Separator />
			{#each markEnds(groups) as { isFirst, value: group }, i (i)}
				{#if !isFirst}
					<Separator />
				{/if}
				{#if 'items' in group}
					{@const { title, items } = group}
					{#if title}
						<p class="text-muted-foreground">{title}</p>
					{/if}
					<div class="grid gap-2">
						{#each items as { href, label }, j (j)}
							{@render MobileLink({ href, label })}
						{/each}
					</div>
				{:else}
					{@const { title, href } = group}
					{@render MobileLink({ href, label: title })}
				{/if}
			{/each}
		</div>
	</Drawer.Content>
</Drawer.Root>

{#snippet MobileLink({
	href,
	label,
	icon: Icon,
}: {
	href: Pathname;
	label: string;
	icon?: Component<IconProps>;
})}
	<a
		href={resolve(href)}
		class="flex items-center gap-2 text-2xl font-medium"
		onclick={() => (open = false)}
	>
		{#if Icon}
			<Icon />
		{/if}
		{label}
	</a>
{/snippet}
