// @ts-check
import { parse } from "./ini.js";

/** @param {string} url */
export default async function onlineSchedule(url, silent=false) {
	const iniText = await (await fetch(url)).text();
	const iniObj = parse(iniText);

	for (const [tableKey, value] of Object.entries(iniObj)) {
		const elemTitle = tableKey.split(" ");
		const elemId = elemTitle.shift(); // Fixes elemTitle as it gets the id

		if (!document.getElementById(elemId)) {
			if (!silent)
				throw new Error(`Table with id ${tableKey} (simple: ${elemId}) not found`);

			continue;
		}

		if (typeof value == "string") {
			document.getElementById(elemId).innerHTML = value;
			continue;
		}

		if (elemTitle.length) {
			document.getElementById(elemId).parentElement.previousElementSibling.innerHTML = elemTitle.join(" ")
		}

		for (const element of document.querySelectorAll(`#${elemId} div`))
			if (!element.hasAttribute("data-keep"))
				element.remove();

		/** @type {[string, string][]} */
		const table = Object.entries(value);
		for (const [rowTitle, rowTime] of table) {
			const rowGroup = document.createElement("div");
			rowGroup.classList.add("schedule-item");

			const timeDiv = document.createElement("div");
			timeDiv.innerHTML = rowTime;
			timeDiv.classList.add("schedule-item-time");
			rowGroup.appendChild(timeDiv);

			const titleDiv = document.createElement("div");
			titleDiv.innerHTML = rowTitle;
			titleDiv.classList.add("schedule-item-title");
			rowGroup.appendChild(titleDiv);

			document.getElementById(elemId).appendChild(rowGroup);
		}
	}
}

onlineSchedule("./dailySchedule.ini").then(() => {
	const getToday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
	Array.from(document.getElementsByClassName("schedule-grid"))
		.filter((elem) => !elem.id.includes(getToday))
		.forEach((elem) => elem.style.display = "none");
})