import React, { ReactNode } from "react";
import styles from "./error-message.module.scss";

interface CustomErrorMessageProps {
    children?: ReactNode;
    [key: string]: any;
}

export function CustomErrorMessage(props: CustomErrorMessageProps) {
    return <small className={styles.error}>{props.children}</small>;
};
