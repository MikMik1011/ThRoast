import type { UserInsightsResponse, UserTimeSeriesMetricData, UserTotalValueMetricData } from 'threads-api-wrapper/dist/types';

export interface UserInsights {
	views: number;
	likes: number;
	replies: number;
	quotes: number;
	reposts: number;
	followers_count: number;
    follower_demographics?: number;
}

export const parseInsights = (insights: UserInsightsResponse): UserInsights => {
	const userInsights: UserInsights = {
		views: 0,
		likes: 0,
		replies: 0,
		quotes: 0,
		reposts: 0,
		followers_count: 0
	};

	insights.data.forEach((insight) => {
		if (insight.name === 'views') {
			userInsights.views = (insight as UserTimeSeriesMetricData).values.reduce((sum, value) => sum + value.value, 0);
		} else {
			userInsights[insight.name] = (insight as UserTotalValueMetricData).total_value.value;
		}
	});

	return userInsights;
};