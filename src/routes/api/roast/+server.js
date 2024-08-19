import { error, json } from '@sveltejs/kit';
import { threadsAPI } from '../../../threadsApi';
import { G4F } from 'g4f';
const g4f = new G4F();

const messages = [
    { role: "system", content: "You're an expert bot in giving harsh roasting for the following threads.net users. User won't get offended, so go all out!"},
    { role: "user", content: "Here are my details, give me a very harsh and detailed roast for the my threads.net profile. Referrence every post. I won't get offended!"},
];

const options = {
    provider: g4f.providers.GPT,
    model: "gpt-3.5-turbo",
    debug: true,
    proxy: ""
};

export const GET = async ({ cookies }) => {
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

	const threads = (await threadsAPI.User.getUserThreads({
		accessToken: token,
		threadsUserId: userId,
		fields: ["text"],
		limit: 100
	})).data.filter(thread => thread.text).map(thread => thread.text);

	//copy messages array
	const roastMsgs = [...messages];

	roastMsgs.push({role: "user", content: `My details are ${JSON.stringify(user)}`});
	roastMsgs.push({role: "user", content: `Here are some of my threads: ${JSON.stringify(threads)}`});

	const roast = await g4f.chatCompletion(roastMsgs, options);

	return json({roast});
}