// src/components/CardList.tsx

export type CardData = {
  label: string;
  image: string;
  link: string;
  external?: boolean;
};

export const cards: CardData[] = [
  { label: "A Game Called Multimania",         image: "/assets/hero/multimania.png",      link: "/multimania"       },
  { label: "YouTube\nChannel about\nNorthwestern",       image: "/assets/hero/youtube.png",    link: "https://www.youtube.com/@roycemettlernu", external: true  },
  { label: "Do Police Complaints Work",   image: "/assets/hero/police-complaints.jpg", link: "/police-complaints" },
  { label: "AI Agent for DIY Projects",      image: "/assets/hero/crafty.jpg",      link: "/crafty"       },
  { label: "Teaching Python\n at Elementary Schools",      image: "/assets/hero/teaching.jpg",   link: "/district-65"    },
  { label: "Research in Reducing Hallucinations",   image: "/assets/hero/mudd.jpg", link: "/ai-research" },
  { label: "AI Engineer\nat Vitu" ,image: "/assets/hero/aiengineer.jpg",link: "/ai-engineer-at-vitu" },
  { label: "Tech Help for Seniors",        image: "/assets/hero/seniorcenter.jpg",     link: "/tech-help"      },
  { label: "First Attempts at Making Music",         image: "/assets/hero/music.jpg",      link: "/music"       },
  { label: "Blog\n(Coming Soon)",          image: "/assets/hero/travel.jpg",       link: "/blog"        },
  { label: "Model UN",      image: "/assets/hero/mun.jpg",        link: "/model-un"    },
  { label: "A Game Called Unipsycho",         image: "/assets/hero/unipsycho.png",      link: "/unipsycho"       },
  { label: "A Game Called Squingo",         image: "/assets/hero/squingo.png",      link: "/squingo"       },
];

// The order the carousel presents the cards in: it opens on "AI Engineer at
// Vitu" in the middle, and as it turns the earlier entries come round next
// (Research, Teaching, ...), ending with "Tech Help for Seniors". The phone
// list shows them top to bottom in that same order.
const FIRST_SHOWN = "/ai-engineer-at-vitu";
const firstShown = Math.max(0, cards.findIndex((card) => card.link === FIRST_SHOWN));
export const cardsInViewingOrder: CardData[] = [
  ...cards.slice(0, firstShown + 1).reverse(),
  ...cards.slice(firstShown + 1).reverse(),
];
