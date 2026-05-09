import { NextRequest } from 'next/server';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string | null> {
	// Check if we have a valid cached token
	if (cachedToken && Date.now() < tokenExpiry) {
		return cachedToken;
	}

	console.log('Fetching new access token from Twitch');

	const response = await fetch(
		`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
		{
			method: 'POST',
		},
	);

	const responseText = await response.text();
	console.log('Twitch response status:', response.status);
	console.log('Twitch response text:', responseText);

	const data = JSON.parse(responseText);
	console.log('Received token response:', data);

	if (!data.access_token) {
		console.error('No access token in response:', data);
		return null;
	}

	cachedToken = data.access_token;
	tokenExpiry = Date.now() + data.expires_in * 1000;

	return cachedToken;
}

export async function GET(request: NextRequest) {
	try {
		const token = await getAccessToken();
		const name = request.nextUrl.searchParams.get('q');

		console.log('Search query:', name);

		if (!token) {
			return new Response('Failed to get access token', { status: 500 });
		}

		const res = await fetch(`https://api.igdb.com/v4/games`, {
			method: 'POST',
			headers: {
				'Client-ID': process.env.TWITCH_CLIENT_ID!,
				Authorization: `Bearer ${token}`,
			},
			body: `search "${name}"; fields name,cover.url,genres.name,platforms.name,first_release_date,summary; limit 10;`,
		});

		console.log('IGDB Response status:', res.status);

		const responseText = await res.text();
		console.log('IGDB Response text:', responseText);

		if (!res.ok) {
			console.error('IGDB API error:', responseText);
			return new Response(`IGDB API error: ${responseText}`, {
				status: 500,
			});
		}

		const rawData = JSON.parse(responseText);
		console.log('IGDB Response data:', rawData);

		// Transform the data to match the expected Game interface
		const data = rawData.map((game: any) => ({
			id: game.id,
			name: game.name,
			coverUrl: game.cover?.url
				? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
				: null,
			genres: game.genres?.map((g: any) => g.name) || [],
			platforms: game.platforms?.map((p: any) => p.name) || [],
			releaseDate: game.first_release_date || null,
			summary: game.summary || null,
		}));

		return Response.json({ data });
	} catch (error) {
		console.error('Search API error:', error);
		return new Response(`Server error: ${error}`, { status: 500 });
	}
}
