// Ninetailed Experience types
export interface NinetailedAudience {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'nt_audience';
      };
    };
  };
  fields: {
    nt_name: string;
    nt_description?: string;
    nt_audience_id: string;
  };
}

export interface NinetailedExperience {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'nt_experience';
      };
    };
  };
  fields: {
    nt_name: string;
    nt_description?: string;
    nt_type: 'nt_personalization' | 'nt_experiment';
    nt_config?: object;
    nt_audience?: NinetailedAudience;
    nt_variants?: Array<Hero | Infoblock | ImageTriplex | FeaturedNews>;
  };
}

export interface NavigationItem {
  sys: {
    id: string;
  };
  fields: {
    label: string;
    url: string;
    children?: NavigationItem[];
    nt_experiences?: NinetailedExperience[];
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
    imageLocation?: 'Right side' | 'Right overlay';
    nt_experiences?: NinetailedExperience[];
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
    nt_experiences?: NinetailedExperience[];
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
    nt_experiences?: NinetailedExperience[];
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
        id: '6NbIn3MpiND4Hybq2U6NV8' | 'featuredNews';
      };
    };
  };
  fields: {
    title: string;
    items: FeaturedNewsItem[];
    nt_experiences?: NinetailedExperience[];
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

