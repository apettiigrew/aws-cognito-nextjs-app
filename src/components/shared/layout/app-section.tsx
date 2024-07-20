import React from "react";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
	id: string,
}

const AppSection = React.forwardRef<HTMLElement, Props>(
	(props, ref) => {
		const { id, children, ...remainingProps } = props;

		return (
			<section id={props.id} ref={ref} {...remainingProps}>
				{children}
			</section>
		);
	}
);

AppSection.displayName = "AppSection";


export { AppSection };
