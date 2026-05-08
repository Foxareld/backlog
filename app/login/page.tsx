'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			if (isSignUp) {
				// Sign up
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/dashboard`,
					},
				});
				if (error) throw error;
				setMessage('Check your email for the confirmation link!');
			} else {
				// Sign in
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				router.push('/dashboard');
				router.refresh();
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4'>
			<div className='max-w-md w-full space-y-8 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg'>
				<div>
					<h2 className='text-3xl font-bold text-center text-black dark:text-white'>
						{isSignUp ? 'Create Account' : 'Sign In'}
					</h2>
					<p className='mt-2 text-center text-zinc-600 dark:text-zinc-400'>
						{isSignUp
							? 'Sign up for your game backlog'
							: 'Welcome back!'}
					</p>
				</div>

				<form onSubmit={handleAuth} className='mt-8 space-y-6'>
					<div className='space-y-4'>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
							>
								Email
							</label>
							<input
								id='email'
								type='email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='you@example.com'
							/>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
							>
								Password
							</label>
							<input
								id='password'
								type='password'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								placeholder='••••••••'
								minLength={6}
							/>
						</div>
					</div>

					{error && (
						<div className='text-red-600 dark:text-red-400 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800'>
							{error}
						</div>
					)}

					{message && (
						<div className='text-green-600 dark:text-green-400 text-sm text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800'>
							{message}
						</div>
					)}

					<button
						type='submit'
						disabled={loading}
						className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						{loading
							? 'Loading...'
							: isSignUp
								? 'Sign Up'
								: 'Sign In'}
					</button>
				</form>

				<div className='text-center'>
					<button
						type='button'
						onClick={() => {
							setIsSignUp(!isSignUp);
							setError(null);
							setMessage(null);
						}}
						className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium'
					>
						{isSignUp
							? 'Already have an account? Sign in'
							: "Don't have an account? Sign up"}
					</button>
				</div>
			</div>
		</div>
	);
}
