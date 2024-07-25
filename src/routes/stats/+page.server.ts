import { error, type ServerLoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { threadsAPI } from '../../threadsApi';
import { parseInsights } from './parseInsights';

export const load: PageServerLoad = async (serverLoadEvent: ServerLoadEvent) => {
	const { cookies } = serverLoadEvent;

	const token = cookies.get('token');
	const userId = cookies.get('userId');
	if (!token || !userId) throw error(401, 'No token provided!');

    const user = await threadsAPI.User.getUserProfile({
        accessToken: token,
        username: "me",
        fields: [
            "username",
            "threads_profile_picture_url"
        ]
    })

	const insights = await threadsAPI.Insights.getUserInsights({
		accessToken: token,
		userId,
		metric: ['views', 'likes', 'replies', 'quotes', 'reposts', 'followers_count'].join(',')
	});

	return {
        user,
		insights: parseInsights(insights)
	};
};
