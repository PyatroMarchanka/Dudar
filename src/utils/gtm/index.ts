type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

const events = {
  songLoaded: "song_loaded",
};

export const gtmPush = (data: any) => {
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event: events.songLoaded, ...data });
};
