import { useState } from "react";

import type { Embed } from "../lib/interfaces";
import { embedToObjectCode } from "../lib/utils";
import Highlight from "./Highlight";

function s(strings: TemplateStringsArray, ...values: unknown[]) {
	let escaped = "";

	for (let i = 0; i < strings.length; i++) {
		if (i > 0) {
			escaped += JSON.stringify(`${values[i - 1]}`);
		}
		escaped += strings[i];
	}

	return escaped;
}

export default function Output({ embed }: { embed: Embed }) {
    const [language, setLanguage] = useState<"json" | "py" | "pretend">("pretend");

	let output = "";

	if (language === "json") {
		output = embedToObjectCode(embed, false);
	} else if (language === "py") {
		output += `embed = discord.Embed(`;

		const kwargs = [];

		if (embed.title) kwargs.push(s`title=${embed.title}`);
		if (embed.url) kwargs.push(s`url=${embed.url}`);
		if (embed.description) kwargs.push(s`description=${embed.description}`);
		if (embed.color)
			kwargs.push(`colour=${embed.color.replace("#", "0x")}`);
		if (embed.timestamp) kwargs.push(`timestamp=datetime.now()`);

		output += `${kwargs.join(",\n                      ")})\n`;

		if (embed.author.name || embed.author.url || embed.author.iconUrl) {
			output += `\nembed.set_author(`;

			const kwargs = [];

			if (embed.author.name) kwargs.push(s`name=${embed.author.name}`);
			if (embed.author.url) kwargs.push(s`url=${embed.author.url}`);
			if (embed.author.iconUrl)
				kwargs.push(s`icon_url=${embed.author.iconUrl}`);

			output += `${kwargs.join(`,\n                 `)})\n`;
		}

		if (embed.fields.length > 0) {
			for (const field of embed.fields) {
				output += s`\nembed.add_field(name=${field.name},\n`;
				output += s`                value=${field.value}`;
				if (field.inline) output += `,\n                inline=True`;
				else output += `,\n                inline=False`;
				output += ")";
			}
			output += "\n";
		}

		if (embed.image) output += s`\nembed.set_image(url=${embed.image})\n`;

		if (embed.thumbnail)
			output += s`\nembed.set_thumbnail(url=${embed.thumbnail})\n`;

		if (embed.footer.text || embed.footer.iconUrl) {
			output += `\nembed.set_footer(`;

			if (embed.footer.text) output += s`text=${embed.footer.text}`;
			if (embed.footer.iconUrl) {
				if (embed.footer.text) output += `,\n                 `;
				output += s`icon_url=${embed.footer.iconUrl}`;
			}
			output += `)\n`;
		}

		output += `\nawait ctx.send(embed=embed)`;
	
	} else if (language === "pretend") {
		output += `{embed}`;
		if (embed.author.name || embed.author.iconUrl || embed.author.url) {
			output += `{author: ${embed.author.name} && url: ${embed.author.url} && icon: ${embed.author.iconUrl}}`;
		}
		if (embed.title) output += `$v{title: ${embed.title}}`;
		if (embed.url) output += `$v{url: ${embed.url}}`;
		if (embed.description) output += `$v{description: ${embed.description}}`;
		if (embed.image) output += `$v{image: ${embed.image}}`;
		if (embed.thumbnail) output += `$v{thumbnail: ${embed.thumbnail}}`;
		if (embed.footer.text || embed.footer.iconUrl) {
			output += `$v{footer: ${embed.footer.text} && icon: ${embed.footer.iconUrl}}`;
		}
		if (embed.timestamp) output += `$v{timestamp: true}`;
	}

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-white">Output</h2>

			<div className="flex my-2 gap-2">
				<select
					name="language"
					id="language"
					value={language}
					onChange={e => setLanguage(e.target.value as "json" | "py" | "pretend")}
				>
					<option value="pretend">pretend</option>
					<option value="json">JSON representation</option>
					<option value="py">discord.py</option>
				</select>
			</div>

			<Highlight
				language={language === "pretend" ? "pretend" : "pretend"}
				className="rounded text-sm"
			>
				{output}
			</Highlight>
		</div>
	);
}