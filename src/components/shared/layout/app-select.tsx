"use client";
import { FormikProps, FormikValues, useField, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from "./app-select.module.scss";


export type SelectOption = { value: string; label: string };


interface AppSelectProps {
    label?: string;
    name: string;
    required: boolean;
    options: SelectOption[];
    validate: (value: string) => string | undefined;
    // formik?: FormikProps<FormikValues>,
    onChange?: (selectedOption: SelectOption) => void;
    placeholder?: string;
}

export function AppSelect(props: AppSelectProps) {
    const { label, required, name, options, onChange, placeholder } = props;
    const [field, meta, helpers] = useField({ name, validate: props.validate });
    const { setFieldValue, values } = useFormikContext();
    const [isOpen, setIsOpen] = useState(false);
    const selectedOpt = options.find((option) => option.value === field.value);

    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(selectedOpt || null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: SelectOption) => {
        setSelectedOption(option);
        setIsOpen(false);
        setFieldValue(name, option.value);
        // helpers.setValue(option.value);
        // field.value = option.value;
    };

    const handleDocumentClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const labelText = useMemo(() => {
        if (!label) {
            return <small style={{ display: "hidden" }}>&nbsp;</small>;
        }

        return required ? `${label}*` : label;
    }, [label, required]);

    const hasError = useMemo(() => {
        return meta.error && meta.touched;
    }, [meta.error, meta.touched]);

    const cn = [styles["select-input"]];
    if (hasError) {
        cn.push(styles['error']);
    }

    const jcn = cn.join(" ");

    return (
        <div defaultValue={field.value} className={styles["custom-select"]} ref={dropdownRef}>
            <label htmlFor={name} className={styles.label}>
                {labelText}
            </label>
            <div className={jcn} onClick={() => setIsOpen(!isOpen)}>
                {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
            </div>
            {isOpen && (
                <div className={styles["select-dropdown"]}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={styles["select-option"]}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )
            }
            {meta.error && meta.touched && (
                <small className={styles["error-text"]}>{meta.error}</small>
            )}
        </div >
    );
};

