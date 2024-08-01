/** Returns whether passed string value is a valid URL */
export function isValidUrl(url: string | undefined): boolean {
	if (typeof url !== "string")
		return false;

	try {
		new URL(url);
	} catch {
		return false;
	}

	return true;
}
