import { OutputChannel, window } from 'vscode';

type OutputChannelName = 'OCM';

class Output {
	private channel: OutputChannel;

	constructor() {
		this.channel = window.createOutputChannel('OCM' as OutputChannelName);
	}

	/**
	 * Send a message to one of the Output Channels of this extension.
	 */
	send(
		message: string,
		{
			newline = 'double',
			revealOutputView = true,
			logLevel = 'info',
			channelName = 'OCM',
		}: {
			newline?: 'none' | 'single' | 'double';
			revealOutputView?: boolean;
			logLevel?: 'info' | 'warn' | 'error';
			channelName?: OutputChannelName;
		} = {},
	): void {

		let channel = this.getChannelByName(channelName);

		if (!channel) {
			channel = window.createOutputChannel(channelName);
			this.channel = channel;
		}

		if (revealOutputView) {
			channel.show(true);
		}

		if (logLevel === 'warn') {
			message = `WARN ${message}`;
		} else if (logLevel === 'error') {
			message = `ERROR ${message}`;
		}

		// enforce newlines at the end, but don't append to the existing ones
		if (newline === 'single') {
			message = `${message.replace(/\n$/, '')}\n`;
		} else if (newline === 'double') {
			message = `${message.replace(/\n?\n$/, '')}\n\n`;
		}

		channel.append(message);
	}

	/**
	 * Show and focus main output channel.
	 */
	show(): void {
		this.channel.show();
	}

	/**
	 * Return Output channel from its name.
	 *
	 * @param channelName Target Output Channel name
	 */
	private getChannelByName(channelName: OutputChannelName): OutputChannel | undefined {
		return this.channel;
	}
}

/**
 * Output view of this extension.
 */
export const output = new Output();

/**
 * @see {@link output.show}
 */
export function showOutputChannel() {
	output.show();
}