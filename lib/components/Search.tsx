'use client';

import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';

interface Game {
	id: number;
	name: string;
	coverUrl: string | null;
	genres: string[];
	platforms: string[];
	releaseDate: number | null;
	summary: string | null;
}

interface SearchProps {
	onSelectGame: (game: Game) => void;
}

export function GameSearch({ onSelectGame }: SearchProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [results, setResults] = useState<Game[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Debounce search to avoid too many API calls
	const debouncedSearch = useDebounce(searchTerm, 500);

	// Search when debounced term changes
	useEffect(() => {
		if (debouncedSearch.length < 2) {
			return;
		}

		const performSearch = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/games/search?q=${encodeURIComponent(debouncedSearch)}`,
				);

				if (!response.ok) {
					throw new Error('Failed to search games');
				}

				const result = await response.json();
				console.log('Search results:', result);
				setResults(result.data || []);
			} catch (err) {
				setError('Failed to search games. Please try again.');
				console.error('Search error:', err);
			} finally {
				setLoading(false);
			}
		};

		performSearch();
	}, [debouncedSearch]);

	return (
		<div className='w-full max-w-2xl'>
			{/* Search Input */}
			<div className='relative'>
				<input
					type='text'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder='Search for games...'
					className='w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>
				{loading && (
					<div className='absolute right-3 top-3.5'>
						<div className='animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full' />
					</div>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<div className='mt-2 text-red-600 dark:text-red-400 text-sm'>
					{error}
				</div>
			)}

			{/* Search Results */}
			{debouncedSearch.length >= 2 && results.length > 0 && (
				<div className='mt-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg max-h-96 overflow-y-auto'>
					{results.map((game) => (
						<button
							key={game.id}
							onClick={() => onSelectGame(game)}
							className='w-full p-4 flex gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left border-b border-zinc-200 dark:border-zinc-800 last:border-b-0'
						>
							{/* Game Cover */}
							{game.coverUrl ? (
								<img
									src={game.coverUrl}
									alt={game.name}
									className='w-16 h-20 object-cover rounded'
								/>
							) : (
								<div className='w-16 h-20 bg-zinc-200 dark:bg-zinc-700 rounded flex items-center justify-center text-zinc-400 text-2xl'>
									🎮
								</div>
							)}

							{/* Game Info */}
							<div className='flex-1 min-w-0'>
								<h3 className='font-semibold text-black dark:text-white truncate'>
									{game.name}
								</h3>
								{game.releaseDate && (
									<p className='text-sm text-zinc-500 dark:text-zinc-400'>
										{game.releaseDate}
									</p>
								)}
								{game.genres.length > 0 && (
									<p className='text-sm text-zinc-600 dark:text-zinc-400 truncate'>
										{game.genres.join(', ')}
									</p>
								)}
								{game.platforms.length > 0 && (
									<p className='text-xs text-zinc-500 dark:text-zinc-500 truncate mt-1'>
										{game.platforms.slice(0, 3).join(', ')}
										{game.platforms.length > 3 && ' ...'}
									</p>
								)}
							</div>

							{/* Add Button */}
							<div className='flex items-center'>
								<span className='text-blue-600 dark:text-blue-400 text-sm font-medium'>
									Add →
								</span>
							</div>
						</button>
					))}
				</div>
			)}

			{/* No Results */}
			{searchTerm.length >= 2 &&
				!loading &&
				results.length === 0 &&
				!error && (
					<div className='mt-4 text-center text-zinc-500 dark:text-zinc-400'>
						No games found. Try a different search term.
					</div>
				)}
		</div>
	);
}
