export interface UserGeolocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface Weather {
  name: string;
  weather: {
    icon: string;
  }[];
  main: {
    temp: number;
  };
  dt: number;
  sys: {
    country: string;
  };
}

export interface NytArticle {
  title: string;
  abstract: string;
  url: string;
  byline: string;
  published_date: string;
  multimedia: {
    url: string;
    width: number;
  }[];
}

export interface NytNews {
  results: NytArticle[];
}
