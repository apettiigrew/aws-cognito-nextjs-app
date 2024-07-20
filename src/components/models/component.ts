import React, { CSSProperties } from "react";

export interface DefaultComponentProps {
	id?: string,
	style?: CSSProperties,
	className?: string,
}

export interface WrapperProps extends DefaultComponentProps {
	children: React.ReactNode,
}
