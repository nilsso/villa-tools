<script lang="ts" module>
	import { resolve } from '$app/paths';
	import type { User } from '$lib/auth';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { cn } from '$lib/utils';
	import { LogOutIcon, SettingsIcon } from '@lucide/svelte';
	import type { ClassValue } from 'svelte/elements';
	import { menuGroups } from './menu-items';

	type Props = {
		user: User | undefined;
		class?: ClassValue;
	};
</script>

<script lang="ts">
	const { user, class: className }: Props = $props();

	const groups = $derived(menuGroups(user?.group));
</script>

<div class={cn('hidden flex-1 items-center justify-between gap-4', className)}>
	<NavigationMenu.Root viewport={false}>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Link href={resolve('/')}>Home</NavigationMenu.Link>
			</NavigationMenu.Item>
			{#each groups as group, i (i)}
				{#if 'items' in group}
					{@const { title, items } = group}
					<NavigationMenu.Item>
						<NavigationMenu.Trigger>{title}</NavigationMenu.Trigger>
						<NavigationMenu.Content>
							<div class="grid w-[300px] p-2">
								{#each items as { path, label, description }, j (j)}
									<NavigationMenu.Link href={resolve(path)}>
										<div class="font-medium">{label}</div>
										{#if description}
											<div class="text-muted-foreground">{description}</div>
										{/if}
									</NavigationMenu.Link>
								{/each}
							</div>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
				{:else}
					{@const { title, path } = group}
					<NavigationMenu.Item>
						<NavigationMenu.Link href={resolve(path)}>
							{title}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/if}
			{/each}
		</NavigationMenu.List>
	</NavigationMenu.Root>
	<NavigationMenu.Root viewport={false}>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>User</NavigationMenu.Trigger>
				<NavigationMenu.Content class="start-auto end-0">
					<div class="grid p-2">
						<NavigationMenu.Link href={resolve('/user')} class="flex-row items-center gap-2">
							<SettingsIcon />
							Settings
						</NavigationMenu.Link>
						<NavigationMenu.Link type="submit" class="flex-row items-center gap-2">
							<form method="POST" action={resolve('/(app)/(public)/logout')} class="contents">
								<button type="submit" class="contents">
									<LogOutIcon />
									Logout
								</button>
							</form>
						</NavigationMenu.Link>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>
