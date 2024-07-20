/** Css breakpoints. Keep in sync with _media-queries.scss */
export enum BreakpointPlatform {
	phone = "phone",
	tabletPortrait = "tablet_p",
	tabletLandscape = "tablet_l",
	desktopSmall = "desktop_s",
	desktop = "desktop",
	highRes = "hr",
}

type BreakPoints = { [key in BreakpointPlatform]: number };

const breakPointsAndPixels: BreakPoints = {
	[BreakpointPlatform.phone]: 370,
	[BreakpointPlatform.tabletPortrait]: 600,
	[BreakpointPlatform.tabletLandscape]: 900,
	[BreakpointPlatform.desktopSmall]: 1400,
	[BreakpointPlatform.desktop]: 1800,
	[BreakpointPlatform.highRes]: 2048,
};

const highestToLowestBreakpoints: { breakPoint: BreakpointPlatform, pixels: number }[] =
	Object.entries(breakPointsAndPixels).sort((a, b) => {
		const valueA = a[1];
		const valueB = b[1];

		if (valueA > valueB)
			return -1;
		if (valueA < valueB)
			return 1;
		else
			return 0;
	}).map((entry) => (
		{
			breakPoint: entry[0] as BreakpointPlatform,
			pixels: entry[1],
		}
	));

// Get the current breakpoint
export function getCurrentBreakpointPlatform() {
	if (typeof window === "undefined") return BreakpointPlatform.phone;

	const innerwidth = window.innerWidth;

	for (let i = 0; i < highestToLowestBreakpoints.length; i++) {
		const bp = highestToLowestBreakpoints[i];
		if (innerwidth >= bp.pixels)
			return bp.breakPoint;
	}

	return BreakpointPlatform.phone;
}

type AppContainerWidthPercentages = { [key in BreakpointPlatform]: number }

