
import styles from "./step-label.module.scss";

interface StepLabelProps {
    icon: React.ReactNode;
    label: string;

}
export function StepLabel(props: StepLabelProps) {
    const { icon, label } = props;

    return (
        <div className={styles.container}>
            <div className={styles["icon-container"]}>{icon}</div>
            <p className={styles.label}>{label}</p>
        </div>
    )
}