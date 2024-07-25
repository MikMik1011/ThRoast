import { error, redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { threadsAPI } from '../../threadsApi';
import { APP_ID, APP_SECRET, REDIRECT_URI } from '$env/static/private';
import type { TokenResponse } from 'threads-api-wrapper/dist/types';

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

	cookies.set('token', token, { path: '/' });
    cookies.set('userId', userId, { path: '/' });

	throw redirect(303, '/stats')
};
