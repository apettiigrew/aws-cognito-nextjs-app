

import styles from "./form-layout.module.scss";
interface FormLayoutProps {
    children: [React.ReactNode, React.ReactNode];
    // title: string;
}
export function FormLayout(props: FormLayoutProps) {
    const { children } = props;
    return (
        <>
            <div className={styles["right-content-headings"]}>
                {children[0]}
            </div>

            <div>
                <div className={styles["form-content"]}>
                    {children[1]}
                </div>
            </div>
        </>
    )

}