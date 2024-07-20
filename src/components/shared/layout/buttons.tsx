import { useMemo } from "react";
import styles from "./buttons.module.scss";

export enum AppButtonVariation {
    /** Background: Primary | Border: Primary | Text: White */
    primaryDefault = "primaryDefault",
    /** Background: Primary | Border: White | Text: White */
    primaryWhiteBorder = "primaryWhiteBorder",
    /** Background: White | Border: White | Text: Primary */
    whiteDefault = "whiteDefault",
}

interface AppButtonProps extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "aria-label" | "aria-description"> {
    ariaLabel: string;
    className?: string;
    variation?: AppButtonVariation;
    children: React.ReactNode;
}

export function AppButton(props: AppButtonProps) {
    const { className, ariaLabel, variation, ...remainingProps } = props;

    const cn = useMemo(() => {
        const classNames: string[] = ["button"];
        if (typeof className !== "undefined")
            classNames.push(className);

        const variationClassName = getButtonVariationClassName(variation);
        classNames.push(variationClassName);

        return classNames.join(" ");
    }, [className, variation]);

    return (
        <button
            className={cn}
            aria-label={ariaLabel}
            {...remainingProps}
        >
            {props.children}
        </button>
    )
}

function getButtonVariationClassName(
    variation?: AppButtonVariation
): string {
    switch (variation) {
        case AppButtonVariation.primaryWhiteBorder: {
            return "app-button-primary-white-border";
        }
        case AppButtonVariation.whiteDefault: {
            return "app-button-white-default";
        }
        case AppButtonVariation.primaryDefault:
        default: {
            return "app-button-primary-default";
        }
    }
}
