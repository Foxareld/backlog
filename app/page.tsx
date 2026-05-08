import Link from 'next/link';

export default function Home() {
	return (
		<div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen'>
			<main className='flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16'>
				<div className='flex flex-col items-center gap-8 text-center'>
					<h1 className='text-5xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50'>
						🎮 Game Backlog Tracker
					</h1>
					<p className='max-w-md text-xl leading-8 text-zinc-600 dark:text-zinc-400'>
						Keep track of your video game backlog. Add games, mark
						your progress, and never forget what to play next.
					</p>
					<div className='flex flex-col gap-4 text-base font-medium sm:flex-row mt-4'>
						<Link
							href='/login'
							className='flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700 md:w-50'
						>
							Get Started
						</Link>
						<Link
							href='/dashboard'
							className='flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-200 dark:bg-zinc-800 px-8 text-black dark:text-white transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700 md:w-50'
						>
							View Dashboard
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
