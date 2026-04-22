export interface Theme {
  name: string;
  imageUrl: string;
  description: string;
}

export interface ThemeOverview {
  username: boolean;
  hostname: boolean;
  timedate: boolean;
  lastFailure: boolean;
  pwdStyle: string;
  features: string[];
}

export type OverviewMap = Record<string, ThemeOverview>;
