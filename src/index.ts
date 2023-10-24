export interface Env {
	SENDGRID_API_KEY: string;
	SENDGRID_FROM_EMAIL: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const apiKey = env.SENDGRID_API_KEY;
		const fromEmail = env.SENDGRID_FROM_EMAIL;
		const requestBody = (await request.json()) as { toEmail: string; subject: string; html: string };
		const toEmail = requestBody.toEmail;
		const subject = requestBody.subject;
		const html = requestBody.html;

		console.log(`Sending email to ${toEmail} with subject ${subject}`);

		await sendEmail(apiKey, fromEmail, toEmail, subject, html);

		return new Response('OK', { status: 200 });
	},
};

const sendEmail = async (apiKey: string, fromEmail: string, toEmail: string, subject: string, html: string) => {
	const url = 'https://api.sendgrid.com/v3/mail/send';
	const data = {
		personalizations: [
			{
				to: [
					{
						email: toEmail,
					},
				],
			},
		],
		from: {
			email: fromEmail,
		},
		subject: subject,
		content: [
			{
				type: 'text/html',
				value: html,
			},
		],
	};

	const headers = {
		Authorization: `Bearer ${apiKey}`,
		'Content-Type': 'application/json',
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error(`Failed to send email: ${response.status} ${response.statusText}`);
	}
};
