import type { JSX } from 'solid-js';
import { isServer, mergeProps } from 'solid-js/web';

type SVGElementTags = JSX.SVGElementTags['svg'];

export type IconData = {
  a: SVGElementTags;
  c: string;
};

export interface IconProps extends SVGElementTags {
  size?: string | number;
  color?: string;
  title?: string;
  style?: JSX.CSSProperties;
}

export declare type IconTypes = (props: IconProps) => JSX.Element;

export function IconTemplate(iconData: IconData, props: IconProps): JSX.Element {
  const mergedProps = mergeProps(iconData.a, props);

  return (
    <svg
      stroke={iconData.a.stroke}
      fill="currentColor"
      stroke-width="0"
      style={{
        ...props.style,
        overflow: 'visible',
        color: props.color || 'currentcolor',
      }}
      {...mergedProps}
      height={props.size || '1em'}
      width={props.size || '1em'}
      innerHTML={iconData.c}
      xmlns="http://www.w3.org/2000/svg"
    >
      {isServer && iconData.c}
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
