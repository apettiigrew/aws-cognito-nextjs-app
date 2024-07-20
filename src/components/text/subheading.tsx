// create a new component called Subheading

import React from 'react';

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