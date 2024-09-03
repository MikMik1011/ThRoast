import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { threadsAPI } from '../../threadsApi';
import type { ProfileResponse } from '@mikmik1011/threads-api-wrapper';

export const load: PageServerLoad = async ({cookies}) => {
	const token = cookies.get('token');
	const userId = cookies.get('userId');
	if (!token || !userId) throw error(401, 'No token provided!');

    let user = JSON.parse(cookies.get('user') ?? 'null') as ProfileResponse;

    if(!user) {
        user = await threadsAPI.User.getUserProfile({
            accessToken: token,
            username: "me",
            fields: [
                "name",
                "username",
                "threads_biography",
            ]
        });
        cookies.set('user', JSON.stringify(user), { path: '/', maxAge: 3600 });
    } 

	return {
        user
	};
};
