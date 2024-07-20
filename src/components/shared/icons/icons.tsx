import { useCombineClassNames } from "@/hooks/use-combine-classnames";
import { SVGProps } from "react";

const xlmns = "http://www.w3.org/2000/svg";

export function OneCirleIcon(props: SVGProps<SVGSVGElement>) {
    const { className, ...remainingProps } = props;
    const cn = useCombineClassNames(props.className);
    return (
        <svg
            className={cn}
            xmlns={xlmns}
            height="24px"
            width="24px"
            viewBox="0 -960 960 960"
            fill="#5f6368"
        >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm-20 200h80v-400H380v80h80v320Z" />
        </svg>
    )
}
export function TwoCirleIcon(props: SVGProps<SVGSVGElement>) {
    const { className, ...remainingProps } = props;
    const cn = useCombineClassNames(props.className);
    return (
        <svg
            className={cn}
            xmlns={xlmns}
            height="24px"
            width="24px"
            viewBox="0 -960 960 960"
            fill="#5f6368"
        >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320ZM360-280h240v-80H440v-80h80q33 0 56.5-23.5T600-520v-80q0-33-23.5-56.5T520-680H360v80h160v80h-80q-33 0-56.5 23.5T360-440v160Z" />
        </svg>
    )
}
export function ThreeCirleIcon(props: SVGProps<SVGSVGElement>) {
    const { className, ...remainingProps } = props;
    const cn = useCombineClassNames(props.className);
    return (
        <svg
            className={cn}
            xmlns={xlmns}
            height="24px"
            width="24px"
            viewBox="0 -960 960 960"
            fill="#5f6368"
        >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320ZM360-280h160q33 0 56.5-23.5T600-360v-60q0-26-17-43t-43-17q26 0 43-17t17-43v-60q0-33-23.5-56.5T520-680H360v80h160v80h-80v80h80v80H360v80Z" />
        </svg>
    )
}
export function FourCirleIcon(props: SVGProps<SVGSVGElement>) {
    const { className, ...remainingProps } = props;
    const cn = useCombineClassNames(props.className);
    return (
        <svg
            className={cn}
            xmlns={xlmns}
            height="24px"
            width="24px"
            viewBox="0 -960 960 960"
            fill="#5f6368"
        >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm40 200h80v-400h-80v160h-80v-160h-80v240h160v160Z" />
        </svg>
    )
}

export function FourCirleIconDark(props: SVGProps<SVGSVGElement>) {
    return (<svg
        xmlns={xlmns}
        width={24}
        height={24}
        viewBox="0 -960 960 960"
        {...props}
    >
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-200h80v-400h-80v160h-80v-160h-80v240h160v160Z" />
    </svg>)
}

export function ThreeCirleIconDark(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns={xlmns}
            width={24}
            height={24}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM360-280h160q33 0 56.5-23.5T600-360v-60q0-26-17-43t-43-17q26 0 43-17t17-43v-60q0-33-23.5-56.5T520-680H360v80h160v80h-80v80h80v80H360v80Z" />
        </svg>
    )
}

export function TwoCirleIconDark(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns={xlmns} height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM360-280h240v-80H440v-80h80q33 0 56.5-23.5T600-520v-80q0-33-23.5-56.5T520-680H360v80h160v80h-80q-33 0-56.5 23.5T360-440v160Z" />
        </svg>
    )
}

export function OneCirleIconDark(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns={xlmns}
            width={24}
            height={24}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-20-200h80v-400H380v80h80v320Z" />
        </svg>
    )
}

