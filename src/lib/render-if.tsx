import { CSSProperties } from "react";


export interface DefaultComponentProps {
    id?: string,
    style?: CSSProperties,
    className?: string,
}

export interface WrapperProps extends DefaultComponentProps {
    children: React.ReactNode,
}

interface Props extends WrapperProps {
    isTrue: boolean
}

export function RenderIf(props: Props) {
    const { isTrue, children } = props;
    return isTrue ? <>{children}</> : null;
}
