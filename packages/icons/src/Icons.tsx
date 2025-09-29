import * as React from 'react';

type IconName = 'check' | 'x' | 'chevron-down' | 'loader';

const paths: Record<IconName, string> = {
  check: 'M20 6 9 17l-5-5',
  x: 'M6 6l12 12M6 18L18 6',
  'chevron-down': 'M6 9l6 6 6-6',
  loader: 'M12 2a10 10 0 1 0 10 10',
};

type IconProps =
  Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'stroke' | 'strokeWidth'> & {
    name: IconName;
    size?: number | string;
    color?: string;           // mappe vers `stroke`
    strokeWidth?: number | string;
  };

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.8,
  ...rest
}: IconProps) {
  const d = paths[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
