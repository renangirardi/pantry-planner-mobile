export type AppArea = 'default' | 'shopping' | 'pantry' | 'market';

export const AREA_THEMES: Record<AppArea, any> = {
  default: {
    primary: 'bg-slate-600 active:bg-slate-700',
    secondary: 'bg-transparent border border-slate-400 active:bg-slate-600',
    secondaryText: 'text-slate-500',
    hexColor: '#3b82f6',
  },
  shopping: {
    primary: 'bg-orange-600 active:bg-orange-700',
    secondary: 'bg-transparent border border-orange-400 active:bg-orange-600',
    secondaryText: 'text-orange-400',
    hexColor: '#ff6900',
  },
  pantry: {
    primary: 'bg-teal-600 active:bg-teal-700',
    secondary: 'bg-transparent border border-teal-400 active:bg-teal-600',
    secondaryText: 'text-teal-500',
    hexColor: '#00bba7',
  },
  market: {
    primary: 'bg-yellow-600 active:bg-yellow-700',
    secondary: 'bg-transparent border border-yellow-400 active:bg-yellow-600',
    secondaryText: 'text-yellow-400',
    hexColor: '#efb100',
  },
};
