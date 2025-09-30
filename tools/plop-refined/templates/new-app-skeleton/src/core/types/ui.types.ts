export interface UILevel {
   level:'primary' | 'optional' | 'critical';
}

export interface UISize {
   size:'small' | 'medium' | 'large';
}

export interface UIActionnable {
   action:()=>void;
}