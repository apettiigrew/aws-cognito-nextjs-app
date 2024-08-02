import { useEffect, useState } from "react";

type QueryRecord = {
	[key: string]: string | undefined;
}

export function useWindowQuery<T extends QueryRecord>(): T {
	const [record, setRecord] = useState<T>(getQueryRecordFromUrl() as T);

	useEffect(() => {
		function callback(newQueryParams: QueryRecord) {
			// console.log("Setting new query params");
			setRecord(newQueryParams as T);
		}

		registerListener(callback);

		return () => unRegisterListener(callback);
	}, []);

	return record;
}

type Listener = (newQueryParams: QueryRecord) => void;

const listeners: Listener[] = [];

function registerListener(listener: Listener) {
	const alreadyExists = listeners.indexOf(listener) !== 0;
	if (alreadyExists)
		return;

	listeners.push(listener);
}

function unRegisterListener(listener: Listener) {
	const index = listeners.indexOf(listener);
	if (index === -1)
		return;

	listeners.splice(index, 1);
}

let lastQueryRecord: QueryRecord = getQueryRecordFromUrl();

function notifyListeners() {
	for (let i = 0; i < listeners.length; i++) {
		const list = listeners[i];
		list(lastQueryRecord);
	}
}

export function getQueryRecordFromUrl<T extends QueryRecord>(): T;
export function getQueryRecordFromUrl(): QueryRecord {
	if (typeof window === "undefined")
		return {};

	const search = location.search;
	if (search === "")
		return {};

	const splitted = search.substring(1, search.length).split("&");
	const record: QueryRecord = {};
	for (let i = 0; i < splitted.length; i++) {
		const kvp = splitted[i].split("=");
		if (kvp.length !== 2)
			continue;
		const key = decodeURIComponent(kvp[0]);
		const value = decodeURIComponent(kvp[1]);
		record[key] = value;
	}
	return record;
}

let previousSearch: string = typeof window !== "undefined" ? location.search : "";

if (typeof window !== "undefined") {
	window.addEventListener("load", (event) => {
		// const head = document.head;
		// const children = head.children;
		// let observeNode: Node | null = null;
		// for (let i = 0, length = children.length; i < length; i++) {
		// 	const child = children[i];
		// 	if (child.tagName === "META" && child.getAttribute("property") === "og:url") {
		// 		observeNode = child;
		// 		break;
		// 	}
		// }

		// console.log("Observe node:", observeNode);
		// if (observeNode === null)
		// 	throw new Error("");

		// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
		const oberserver = new MutationObserver((mutations) => {
			// Debugging
			// console.log("Observe trigger");
			if (location.search === previousSearch)
				return;

			previousSearch = location.search;
			lastQueryRecord = getQueryRecordFromUrl();
			// console.log("last query record:", lastQueryRecord);
			notifyListeners();
		});

		oberserver.observe(document.head, { childList: true });
		// oberserver.observe(head, { childList: true });
	});
}

