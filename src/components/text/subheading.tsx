// create a new component called Subheading

import React from 'react';


interface SubHeadingProps {
    children: React.ReactNode;
}

export function SubHeading(props: SubHeadingProps) {
    const { children } = props;
    return <h5>{children}</h5>
}