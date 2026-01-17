export type AttributeData = {
  logoUrl: string;
  nameCn: string;
  nameEn: string;
  battleMultiplier?: {
    offense?: {
      "0.5"?: string[];
      "2.0"?: string[];
    };
    defense?: {
      "0.5"?: string[];
      "2.0"?: string[];
    };
  };
};

export type PetData = {
  name: {
    zh: string;
    en: string;
  };
  image: string;
  attributes: string[];
  introduction?: {
    zh?: string;
    en?: string;
  };
  evolution?: {
    level?: number;
    next?: string;
    prev?: string | null;
  } | null;
  distribution?: {
    zh?: string;
    en?: string;
  } | null;
};
