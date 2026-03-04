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
    backgroundImage?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    video?: {
      fields: {
        file: {
          url: string;
          contentType: string;
        };
        title: string;
      };
    };
    videoUrl?: string;
    imageLocation?: 'Right side' | 'Right overlay';
    layout?: 'Centered with video' | 'Image right' | 'Image overlay';
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

export interface DuplexContainer {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'duplexContainer';
      };
    };
  };
  fields: {
    title: string;
    subtitle?: string;
    image: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
    imagePosition?: 'Left' | 'Right';
    ctaText?: string;
    ctaUrl?: string;
    nt_experiences?: NinetailedExperience[];
  };
}

export interface SolutionItem {
  sys: {
    id: string;
  };
  fields: {
    number?: string;
    title: string;
    description?: string;
    icon?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };
}

export interface SolutionsList {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'solutionsList';
      };
    };
  };
  fields: {
    title: string;
    subtitle?: string;
    items: SolutionItem[];
    nt_experiences?: NinetailedExperience[];
  };
}

export interface ValuePropositionItem {
  sys: {
    id: string;
  };
  fields: {
    text: string;
    icon?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };
}

export interface ValuePropositions {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'valuePropositions';
      };
    };
  };
  fields: {
    title: string;
    subtitle?: string;
    propositions?: string[];
    items?: ValuePropositionItem[];
    nt_experiences?: NinetailedExperience[];
  };
}

export type Module = Hero | Infoblock | ImageTriplex | FeaturedNews | DuplexContainer | SolutionsList | ValuePropositions;

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

