export function getSessionStorageValue(key: string): string | null {
	try {
		return window.sessionStorage.getItem(key);
	} catch (err) {
		console.error(`Unable to retrieve value '${key}' from window.sessionStorage`);
		return null;
	}
}

export function setSessionStorageValue(key: string, value: string): boolean {
	try {
		window.sessionStorage.setItem(key, value);
		return true;
	} catch (err) {
		console.error(`Unable to set value '${key}' in window.sessionStorage`);
		return false;
	}
}

export function removeSessionStorageValue(key: string): boolean {
	try {
		window.sessionStorage.removeItem(key);
		return true;
	} catch (err) {
		console.error(`Unable to remove value '${key}' in window.sessionStorage`);
		return false;
	}
}

export function getLocalStorageValue(key: string): string | null {
	try {
		return window.localStorage.getItem(key);
	} catch (err) {
		console.error(`Unable to retrieve value '${key}' from window.localStorage`);
		return null;
	}
}

export function setLocalStorageValue(key: string, value: string): boolean {
	try {
		window.localStorage.setItem(key, value);
		return true;
	} catch (err) {
		console.error(`Unable to set value '${key}' in window.localStorage`);
		return false;
	}
}

export function removeLocalStorageValue(key: string): boolean {
	try {
		window.localStorage.removeItem(key);
		return true;
	} catch (err) {
		console.error(`Unable to remove value '${key}' in window.localStorage`);
		return false;
	}
}

