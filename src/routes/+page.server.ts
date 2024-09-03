import type { PageServerLoad } from './$types';
import { threadsAPI } from '../threadsApi';
import { type AuthScopes } from '@mikmik1011/threads-api-wrapper';

import { APP_ID, REDIRECT_URI } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

const SCOPES = [
	'threads_basic',
	'threads_content_publish',
	'threads_manage_insights',
	'threads_manage_replies',
	'threads_read_replies'
];

export const load: PageServerLoad = async ({cookies}) => {
	if(cookies.get('token') && cookies.get('userId')) {
		throw redirect(303, '/roast');
	}

	const authUrl = threadsAPI.getAuthorizationUrl({
		clientId: APP_ID,
		redirectUri: REDIRECT_URI,
		scopes: SCOPES as AuthScopes[]
	});

	return {
		authUrl
	};
};
