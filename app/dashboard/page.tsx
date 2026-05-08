'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				router.push('/login');
				return;
			}

			setUser(user);
			setLoading(false);
		};

		getUser();
	}, [router, supabase]);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push('/login');
		router.refresh();
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black'>
				<div className='text-zinc-600 dark:text-zinc-400'>
					Loading...
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-zinc-50 dark:bg-black p-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex justify-between items-center mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow'>
					<div>
						<h1 className='text-3xl font-bold text-black dark:text-white'>
							My Game Backlog
						</h1>
						<p className='text-zinc-600 dark:text-zinc-400 mt-1'>
							{user?.email}
						</p>
					</div>
					<button
						onClick={handleSignOut}
						className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium'
					>
						Sign Out
					</button>
				</div>

				<div className='bg-white dark:bg-zinc-900 rounded-lg shadow p-8 text-center'>
					<p className='text-zinc-600 dark:text-zinc-400 text-lg'>
						🎮 Dashboard coming soon! You&apos;re successfully
						logged in.
					</p>
					<p className='text-zinc-500 dark:text-zinc-500 text-sm mt-4'>
						Next step: Add game search and backlog list
						functionality
					</p>
				</div>
			</div>
		</div>
	);
}
