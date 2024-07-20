

import { useField } from "formik";
import { useMemo } from "react";
import styles from "./input-field.module.scss";
import { useCombineClassNames } from "@/hooks/use-combine-classnames";


type Props = {
    name: string;
    label: string;
    required: boolean;
    type: string;
    className?: string;
    validate?: (value: string) => string | undefined;
};

type InputFieldProps = Props;

export function InputField(props: InputFieldProps) {
    const { type, name, label, validate, required, ...restOfProps } = props;
    const [field, meta, helpers] = useField({ name, validate });

    const labelText = useMemo(() => {
        return required ? `${label}*` : label;
    }, [label, required]);

    const hasError = useMemo(() => {
        return meta.error && meta.touched;
    }, [meta.error, meta.touched]);

    const cn = [styles['input-field']];
    if (hasError) {
        cn.push(styles['error']);
    }

    const jcn = cn.join(" ");

    const containerCCN = useCombineClassNames(props.className);

    return (
        <div className={styles["form-control"]}>
            <label htmlFor={name} className={styles.label}>
                {labelText}
            </label>
            <input
                id={name}
                type={type}
                className={jcn}
                onFocus={() => helpers.setTouched(false)}
                {...field}
                {...restOfProps}
            />
            {meta.error && meta.touched && (
                <small className={styles["error-text"]}>{meta.error}</small>
            )}
        </div>
    );
};


