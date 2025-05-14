// @ts-check
import { parse } from "./ini.js";

/** @param {string} url */
export default async function onlineSchedule(url, silent=false, callback=() => {}) {
	const iniText = await (await fetch(url)).text();
	const iniObj = parse(iniText);

	for (const [tableKey, value] of Object.entries(iniObj)) {
		if (tableKey.endsWith('-slideCfg')) {
			console.log(tableKey, value)

			/** @type {Partial<{ sideBanner: string; fullBanner: string; DayLeftTitle: string; slideLength: number|string; }>} */
			const slideCfg = value;

			const slide = document.getElementById(tableKey.replace('-slideCfg', ''));

			if ('sideBanner' in slideCfg) {
				const sideImg = document.createElement("img");
				sideImg.src = slideCfg.sideBanner;
				sideImg.classList.add("rightBanner");

				if (slide) {
					slide.classList.add("properBanner")
					slide.appendChild(sideImg);
				}
			}

			if ('fullBanner' in slideCfg) {
				console.log(true)
				const sideImg = document.createElement("img");
				sideImg.src = slideCfg.fullBanner;
				sideImg.classList.add("rightBanner");

				if (slide)
					slide.appendChild(sideImg);
			}

			if ('DayLeftTitle' in slideCfg) {
				const h1 = document.createElement("h1");
				h1.classList.add("leftTitleText", "dayTitle");
				h1.innerHTML = new Date().toLocaleDateString("en-US", { weekday: "long"}) + slideCfg.DayLeftTitle;

				if (slide)
					slide.appendChild(h1);
			}

			if ('slideLength' in slideCfg) {
				const slideLength = typeof slideCfg.slideLength == "string" ? parseInt(slideCfg.slideLength) : slideCfg.slideLength;
				if (slide && !isNaN(slideLength)) {
					slide.setAttribute("data-bs-interval", slideLength.toString());
				}
			}
			continue;
		}

		if (!document.getElementById(tableKey)) {
			if (!silent)
				throw new Error(`Table with id ${tableKey} (simple: ${tableKey}) not found`);

			continue;
		}

		if (typeof value == "string") {
			document.getElementById(tableKey).innerHTML = value;
			continue;
		}

		for (const element of document.querySelectorAll(`#${tableKey} div`))
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

			document.getElementById(tableKey).appendChild(rowGroup);
		}
	}

	callback();
}