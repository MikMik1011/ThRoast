import { error, json } from '@sveltejs/kit';
import { threadsAPI } from '../../../threadsApi';
import { G4F } from 'g4f';
const g4f = new G4F();

const messages = [
	{
		role: 'system',
		content:
			"You're an expert bot in giving harsh roasting for the following threads.net users. User won't get offended, so go all out!"
	},
	{
		role: 'user',
		content:
			"Here are my details, give me a very harsh and detailed roast for the my threads.net profile. Pay attention to every post AND reply. I won't get offended!"
	}
];

const options = {
	provider: g4f.providers.GPT,
	model: 'gpt-4',
	debug: true
};

export const GET = async ({ cookies }) => {
	const token = cookies.get('token');
	const userId = cookies.get('userId');
	if (!token || !userId) throw error(401, 'No token provided!');

	const user = cookies.get('user') ?? 'not available';

	const threads = (
		await threadsAPI.User.getUserThreads({
			accessToken: token,
			threadsUserId: userId,
			fields: ['text'],
			limit: 100
		})
	).data
		.filter((thread) => thread.text)
		.map((thread) => thread.text);

	const replies = (
		await threadsAPI.User.getUserReplies({
			accessToken: token,
			threadsUserId: userId,
			fields: ['text', 'root_post'],
			limit: 100
		})
	).data.filter((thread) => thread.text);

	console.log(replies);

	let pairs = replies
		.filter((thread) => thread.root_post?.id)
		.map(
			async (thread) =>
				new Object({
					root:
						(
							await threadsAPI.Post.getMediaData({
								accessToken: token,
								id: thread.root_post?.id as string,
								fields: ['text']
							})
						).text ?? '',
					reply: thread.text
				})
		);

	pairs = (await Promise.allSettled(pairs))
		.filter((pair) => pair.status === 'fulfilled')
		.map((pair) => pair.value);

	//copy messages array
	const roastMsgs = [...messages];

	roastMsgs.push({ role: 'user', content: `My details are ${user}` });
	roastMsgs.push({
		role: 'user',
		content: `Here are some of my threads: ${JSON.stringify(threads)}`
	});
	roastMsgs.push({
		role: 'user',
		content: `Here are some of my replies: ${JSON.stringify(pairs)}`
	});
	roastMsgs.push({ role: 'user', content: `Reply in Serbian language.` });
	// roastMsgs.push({ role: 'user', content: `Feel free to use insults and swear words.` });

	console.log(roastMsgs);

	const roast = await g4f.chatCompletion(roastMsgs, options);

	return json({ roast });
};
