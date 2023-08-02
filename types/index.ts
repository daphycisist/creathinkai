import { LucideIcon } from 'lucide-react';

export interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export interface EmptyProps {
  label: string;
}
