import { error, redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { threadsAPI } from '../../threadsApi';
import { APP_ID, APP_SECRET, REDIRECT_URI } from '$env/static/private';
import type { TokenResponse } from '@mikmik1011/threads-api-wrapper/dist/types';

export const load: PageServerLoad = async (serverLoadEvent: ServerLoadEvent) => {
	const { url, cookies } = serverLoadEvent;
	if (!url.searchParams.has('code')) {
		throw error(400, 'cancelled');
	}
	const code = url.searchParams.get('code') as string;

	const response = (await threadsAPI.exchangeCodeForToken({
		code: code.toString(),
		clientId: APP_ID,
		clientSecret: APP_SECRET,
		redirectUri: REDIRECT_URI
	})) as TokenResponse;

	const token = response.access_token;
	const userId = response.user_id;

	cookies.set('token', token, { path: '/', maxAge: 3600 });
    cookies.set('userId', userId, { path: '/', maxAge: 3600 });
	cookies.delete('user', { path: '/' });

	throw redirect(303, '/roast')
};
