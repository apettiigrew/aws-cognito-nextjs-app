import { useCombineClassNames } from "@/hooks/use-combine-classnames";
import { SVGProps } from "react";

const xlmns = "http://www.w3.org/2000/svg";

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
    const { className, ...remainingProps } = props;
    const cn = useCombineClassNames(props.className);

    return (
        <svg
            className={cn}
            xmlns={xlmns}
            viewBox="0 0 186.69 190.5">
            <path
                fill="#4285f4"
                d="M95.25 77.932v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
            />
            <path
                fill="#34a853"
                d="m41.869 113.38-6.972 5.337-24.679 19.223c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
            />
            <path
                fill="#fbbc05"
                d="M10.218 52.561C3.724 65.376.001 79.837.001 95.25s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
            />
            <path
                fill="#ea4335"
                d="M95.25 37.927c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276C142.442 9.439 120.968 0 95.25 0 58.016 0 25.891 21.388 10.218 52.561L41.91 77.153c7.533-22.514 28.575-39.226 53.34-39.226z"
            />
        </svg>
    )
}
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

