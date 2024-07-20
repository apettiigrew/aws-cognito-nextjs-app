/** Combine classnames */
export function cc(...classNames: (string | undefined)[]) {
	const className = classNames.filter(cn => typeof cn !== "undefined").join(" ");
	return className !== "" ? className : undefined;
}

/** Return classname if condition is met. Else undefined */
export function classIf(condition: boolean, className: string) {
	return condition ? className : undefined;
}
