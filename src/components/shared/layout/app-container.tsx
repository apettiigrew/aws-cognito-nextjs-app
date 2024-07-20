
import React from "react";
import styles from "./app-container.module.scss";
import { useCombineClassNames } from "@/hooks/use-combine-classnames";
import { WrapperProps } from "@/lib/render-if";

export enum AppContainerSemanticTypes {
	div = 1,
	article = 2
}

interface Props extends WrapperProps {
	/** If true, uses padding instead of max-width to achieve effect */
	usePadding?: boolean,
	semanticType?: AppContainerSemanticTypes,
	/** Allows you to use a smaller container variation than the default */
	size?: "default" | "small",
}

const AppContainer = React.forwardRef<HTMLDivElement, Props>(
	(props, ref) => {
		let sizeClass: string | undefined;
		if (props.size === "small")
			sizeClass = styles.small;
		let functionToUse: string | undefined;
		if (props.usePadding === true)
			functionToUse = styles["use-padding"];

		const className = useCombineClassNames(
			props.className,
			styles.root,
			functionToUse,
			sizeClass,
		);

		switch (props.semanticType) {
			case AppContainerSemanticTypes.article: {
				return (
					<article id={props.id} className={className} style={props.style} ref={ref}>
						{props.children}
					</article>
				);
			}
			default: {
				return (
					<div id={props.id} className={className} style={props.style} ref={ref}>
						{props.children}
					</div>
				);
			}
		}
	}
);

AppContainer.displayName = "AppContainer";

export { AppContainer };
