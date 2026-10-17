export interface AppUpdateTranslation {
  title: string;
  description: string;
}

export interface AppUpdate {
  _id: string;
  key: string;
  date: string;
  prNumbers?: number[];
  translations: {
    [languageCode: string]: AppUpdateTranslation;
  };
}
