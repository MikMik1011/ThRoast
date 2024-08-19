import { error, type ServerLoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { threadsAPI } from '../../threadsApi';

export const load: PageServerLoad = async ({cookies}) => {
	const token = cookies.get('token');
	const userId = cookies.get('userId');
	if (!token || !userId) throw error(401, 'No token provided!');

    const user = await threadsAPI.User.getUserProfile({
        accessToken: token,
        username: "me",
        fields: [
			"name",
            "username",
			"threads_biography",
        ]
    })

	return {
        user
	};
};
