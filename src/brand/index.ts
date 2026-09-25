import { BagpipeTypes } from '../interfaces';

export enum Brand {
  Bagpipe = 'bagpipe',
  Flute = 'flute',
}

export interface BrandConfig {
  brand: Brand;
  name: string;
  siteUrl: string;
  description: string;
  // Used in generated SEO texts: "Learn to play X on <instrumentNoun>"
  instrumentNoun: string;
  instruments: BagpipeTypes[];
  defaultInstrument: BagpipeTypes;
}

export const fluteInstruments = [BagpipeTypes.TinWhistle];

export const isFluteInstrument = (type: BagpipeTypes) => fluteInstruments.includes(type);

const bagpipeInstruments = (Object.values(BagpipeTypes) as BagpipeTypes[]).filter(
  (type) => !isFluteInstrument(type)
);

export const brands: Record<Brand, BrandConfig> = {
  [Brand.Bagpipe]: {
    brand: Brand.Bagpipe,
    name: 'Duda Hero',
    siteUrl: 'https://dudahero.org',
    description: 'Interactive platform for learning to play various types of bagpipes',
    instrumentNoun: 'bagpipes',
    instruments: bagpipeInstruments,
    defaultInstrument: BagpipeTypes.BelarusianTraditionalDuda,
  },
  [Brand.Flute]: {
    brand: Brand.Flute,
    name: 'Flute Hero',
    siteUrl: 'https://flute.dudahero.org',
    description: 'Interactive platform for learning to play tin whistle, sopilka, dudka and recorder',
    instrumentNoun: 'flute',
    instruments: fluteInstruments,
    defaultInstrument: BagpipeTypes.TinWhistle,
  },
};

const BRAND_OVERRIDE_KEY = 'brandOverride';

const isBrand = (value: string | null | undefined): value is Brand =>
  !!value && (Object.values(Brand) as string[]).includes(value);

// Dev/preview override: `?brand=flute` is remembered for the session, `?brand=` clears it.
const getBrandOverride = (): Brand | undefined => {
  try {
    const param = new URLSearchParams(window.location.search).get('brand');
    if (param !== null) {
      if (isBrand(param)) {
        sessionStorage.setItem(BRAND_OVERRIDE_KEY, param);
        return param;
      }
      sessionStorage.removeItem(BRAND_OVERRIDE_KEY);
      return undefined;
    }
    const stored = sessionStorage.getItem(BRAND_OVERRIDE_KEY);
    return isBrand(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
};

export const getBrand = (): Brand => {
  const override = getBrandOverride();
  if (override) return override;

  const envBrand = process.env.REACT_APP_BRAND;
  if (isBrand(envBrand)) return envBrand;

  if (window.location.hostname.startsWith('flute.')) return Brand.Flute;

  return Brand.Bagpipe;
};

// The brand is fixed for the lifetime of the page, so it is resolved once.
export const currentBrand: BrandConfig = brands[getBrand()];

export const isFluteBrand = currentBrand.brand === Brand.Flute;

// User settings are shared between brands, so a saved instrument may belong to the other site
export const resolveInstrumentForBrand = (type?: BagpipeTypes): BagpipeTypes =>
  type && currentBrand.instruments.includes(type) ? type : currentBrand.defaultInstrument;
