export interface OptionItem {
    label: string;
    value: number | string;
}

export interface SocialMediaItem {
  label: string;
  key: string;
  icon: string;
}

export interface CropConfig {
  unit: 'px' | '%';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeItem {
  name: string;
  width: number;
  height: number;
}

