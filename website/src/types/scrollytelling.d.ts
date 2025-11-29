declare module "@bsmnt/scrollytelling" {
    import { ReactNode, FC } from "react";

    export interface ScrollytellingRootProps {
        children?: ReactNode;
        debug?:
        | false
        | {
            label: string;
            visualizer?: boolean;
            markers?: boolean;
        };
        start?: string | number | ((self: any) => string | number);
        end?: string | number | ((self: any) => string | number);
        callbacks?: {
            onEnter?: () => void;
            onLeave?: () => void;
            onUpdate?: (progress: number) => void;
            onRefresh?: () => void;
        };
        scrub?: number | boolean;
        defaults?: any;
        toggleActions?: string;
        disabled?: boolean;
        trigger?: string | HTMLElement;
    }

    interface TweenConfig {
        start?: number;
        end?: number;
        target?: any;
        to?: any;
        from?: any;
        fromTo?: any[];
        duration?: number;
        [key: string]: any; // Allow any additional GSAP properties
    }

    export interface ScrollytellingAnimationProps {
        tween?: TweenConfig | TweenConfig[];
        disabled?: boolean;
        children?: ReactNode;
    }

    export interface ScrollytellingPinProps {
        childHeight?: string;
        pinSpacerHeight?: string;
        pinSpacerClassName?: string;
        children?: ReactNode;
    }

    export interface ScrollytellingWaypointProps {
        at?: number;
        tween?: TweenConfig | TweenConfig[];
        children?: ReactNode;
        onReverseCall?: () => void;
        onCall?: () => void;
    }

    export interface ScrollytellingStaggerProps {
        overlap?: number;
        tween?: TweenConfig | TweenConfig[];
        children?: ReactNode;
    }

    export interface ScrollytellingParallaxProps {
        tween?: TweenConfig | TweenConfig[];
        children?: ReactNode;
    }

    export interface ScrollytellingContext {
        timeline?: any;
    }

    export const Root: FC<ScrollytellingRootProps>;
    export const Animation: FC<ScrollytellingAnimationProps>;
    export const Pin: FC<ScrollytellingPinProps>;
    export const Waypoint: FC<ScrollytellingWaypointProps>;
    export const Stagger: FC<ScrollytellingStaggerProps>;
    export const Parallax: FC<ScrollytellingParallaxProps>;
    export function useScrollytelling(): ScrollytellingContext;
}
