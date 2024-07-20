


import React from 'react';
import styles from "./app-checkbox.module.scss";
import { useField } from 'formik';

interface AppCheckboxProps {
    name: string;
    label: string;
    required?: boolean;
    onChange?: (checked: boolean) => void;
    validate?: (value: string) => string | undefined;
}

export function AppCheckbox(props: AppCheckboxProps) {
    const { name, label, required, onChange, validate, ...restOfProps } = props;
    const [field, meta, helpers] = useField({ name, validate });
    return (
        <div className="form-control">
            <label className={styles["checkbox-option"]}>
                <input
                    className={styles.input}
                    type="checkbox"
                    checked={field.value}
                    {...restOfProps}
                    {...field}
                />
                {label}
            </label>
            {meta.error && meta.touched && (
                <small className={styles["error-text"]}>{meta.error}</small>
            )}
        </div>
    );
};

