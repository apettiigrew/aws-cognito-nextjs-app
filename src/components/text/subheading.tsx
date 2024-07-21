

import React from 'react';
import styles from './subheading.module.scss';

/** Enum of the levels of the heading */
export enum AppHeadingElement {
    h1 = 1,
    h2 = 2,
    h3 = 3,
    h4 = 4,
    h5 = 5,
    h6 = 6,
}


export interface SubHeadingProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
    /** determines the level of a heading: 1, 2, 3, 4, 5 or 6 */
    // headingElement: AppHeadingElement;
    // headingStyle: AppHeadingElement;

    children: React.ReactNode;

}


export function SubHeading(props: SubHeadingProps) {
    const { className, ...remainingProps } = props;
    const { children } = props;
    return <h5 className={className} {...remainingProps}>{children}</h5>
}


export interface HeadingProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
    /** determines the level of a heading: 1, 2, 3, 4, 5 or 6 */
    headingElement: AppHeadingElement;
    children: React.ReactNode;
}


export function Heading(props: HeadingProps) {
    const { headingElement, className, ...remainingProps } = props;
    const { children } = props;

    switch (headingElement) {
        case AppHeadingElement.h1:
            return <h1 className={className} {...remainingProps}>{children}</h1>;
        case AppHeadingElement.h2:
            return <h2 className={className} {...remainingProps}>{children}</h2>;
        case AppHeadingElement.h3:
            return <h3 className={className} {...remainingProps}>{children}</h3>;
        case AppHeadingElement.h4:
            return <h4 className={className} {...remainingProps}>{children}</h4>;
        case AppHeadingElement.h5:
            return <h5 className={className} {...remainingProps}>{children}</h5>;
        case AppHeadingElement.h6:
            return <h6 className={className} {...remainingProps}>{children}</h6>;
        default:
            return <h6 className={className} {...remainingProps}>{children}</h6>;

    }

}