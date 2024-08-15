import { Light } from "react-syntax-highlighter";
import py from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

Light.registerLanguage("py", py);

export default function Highlight({
	children,
	language,
	...props
}: Omit<
	React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLPreElement>,
		HTMLPreElement
	>,
	"style" | "ref"
> & {
	children: string;
	language: "pretend";
}) {
	return (
		<Light language={language} style={atomOneDark} wrapLongLines {...props}>
			{children}
		</Light>
	);
}
