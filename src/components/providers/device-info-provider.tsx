
"use client";
import { BreakpointPlatform, getCurrentBreakpointPlatform } from "@/lib/css-vars";
import React, { createContext } from "react";
import { WrapperProps } from "../models/component";

export enum DeviceInputType {
	touch = 0,
	mouse = 1
}

export interface DeviceInfoContextState {
	previousBreakpoint: BreakpointPlatform,
	breakPoint: BreakpointPlatform,
	inputType: DeviceInputType,
}

// Use mobile as default (biggest user base), because the window object
// is not available during nextjs build
const defaultState: DeviceInfoContextState = {
	previousBreakpoint: BreakpointPlatform.phone,
	breakPoint: BreakpointPlatform.phone,
	inputType: DeviceInputType.touch,
};

export const DeviceInfoContext = createContext<DeviceInfoContextState>(defaultState);

/**
 * Provides/listen to update regarding device information like if we're on mobile resolution
 * or if it's a touch or mouse device, ...
 */
export class DeviceInfoProvider extends React.Component<WrapperProps, DeviceInfoContextState> {
	_touchMatcher: MediaQueryList | undefined;

	constructor(props: any) {
		super(props);
		this.state = { ...defaultState };

		// Makes sure that the this keyword in each function points to this class
		// and not the function caller (e.g. an event trigger)
		this.updateBreakPoint = this.updateBreakPoint.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
		this.updateInputType = this.updateInputType.bind(this);
		this.onInputTypeChange = this.onInputTypeChange.bind(this);
	}

	componentDidMount() {
		// Because window object doesn't exist during nextjs build phase
		if (typeof window === "undefined")
			return;

		// Window resize event listener setup
		window.addEventListener("resize", this.onWindowResize);
		const newBreakPoint = getCurrentBreakpointPlatform();

		let newInputType = DeviceInputType.touch;
		// Matches media query for pointer: coarse, aka touch devices
		// Check for device support first
		if (typeof window.matchMedia === "function") {
			const matchTouch = "(pointer: coarse)";
			this._touchMatcher = window.matchMedia(matchTouch);
			if (typeof this._touchMatcher.addEventListener === "function")
				this._touchMatcher.addEventListener("change", this.onInputTypeChange);
			newInputType = this._touchMatcher.matches ? DeviceInputType.touch : DeviceInputType.mouse;
		}

		// Set initial updated state
		this.setState({
			...this.state,
			breakPoint: newBreakPoint,
			inputType: newInputType,
			previousBreakpoint: this.state.breakPoint,
		});
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onWindowResize);

		if (typeof this._touchMatcher !== "undefined" && typeof this._touchMatcher.removeEventListener === "function")
			this._touchMatcher.removeEventListener("change", this.onInputTypeChange);
	}

	onWindowResize(ev: UIEvent) {
		this.updateBreakPoint();
	}

	onInputTypeChange(ev: MediaQueryListEvent) {
		this.updateInputType(ev.matches);
	}

	updateBreakPoint() {
		const currentBreakpoint = getCurrentBreakpointPlatform();
		if (this.state.breakPoint !== currentBreakpoint) {
			this.setState({
				...this.state,
				breakPoint: currentBreakpoint,
				previousBreakpoint: this.state.breakPoint,
			});
		}
	}


	updateInputType(matches: boolean) {
		const newInputType = matches ? DeviceInputType.touch : DeviceInputType.mouse;
		if (this.state.inputType !== newInputType)
			this.setState({ ...this.state, inputType: newInputType });
	}

	render(): React.ReactNode {
		return (
			<DeviceInfoContext.Provider value={this.state}>
				{this.props.children}
			</DeviceInfoContext.Provider>
		);
	}
}
