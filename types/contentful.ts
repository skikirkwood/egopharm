export interface NavigationItem {
  sys: {
    id: string;
  };
  fields: {
    label: string;
    url: string;
    children?: NavigationItem[];
  };
}

export interface Navigation {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    items?: NavigationItem[];
  };
}

export interface SiteSettings {
  sys: {
    id: string;
  };
  fields: {
    logo?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    siteName?: string;
  };
}

export interface Hero {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'hero';
      };
    };
  };
  fields: {
    title: string;
    subtitle?: string;
    backgroundImage: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    ctaText?: string;
    ctaLink?: string;
  };
}

export interface Infoblock {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'infoblock';
      };
    };
  };
  fields: {
    title: string;
    body: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };
}

export interface ImageTriplexItem {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    backgroundImage: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    body: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

export interface ImageTriplex {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'imageTriplex';
      };
    };
  };
  fields: {
    title: string;
    items: ImageTriplexItem[];
  };
}

export interface FeaturedNewsItem {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    image: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    body: string;
    url?: string;
  };
}

export interface FeaturedNews {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'featuredNews';
      };
    };
  };
  fields: {
    title: string;
    items: FeaturedNewsItem[];
  };
}

export type Module = Hero | Infoblock | ImageTriplex | FeaturedNews;

export interface Page {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    navigation?: Navigation;
    modules: Module[];
  };
}

