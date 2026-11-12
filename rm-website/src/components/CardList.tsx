// src/components/CardList.tsx

export type CardData = {
  label: string;
  image: string;
  link: string;
  external?: boolean;
  /**
   * Widths of the smaller copies of `image` in /assets/hero/sized/, made by
   * scripts/make-card-images.py (ascending). Leave out if there are none.
   */
  sizes?: number[];
};

export const cards: CardData[] = [
  { label: "A Game Called Multimania",         image: "/assets/hero/multimania.png",      link: "/multimania"       },
  { label: "YouTube\nChannel about\nNorthwestern",       image: "/assets/hero/youtube.png",    link: "https://www.youtube.com/@roycemettlernu", external: true  },
  { label: "Do Police Complaints Work",   image: "/assets/hero/police-complaints.jpg", link: "/police-complaints", sizes: [1280] },
  { label: "AI Agent for DIY Projects",      image: "/assets/hero/crafty.jpg",      link: "/crafty", sizes: [1280, 2560] },
  { label: "Teaching Python\n at Elementary Schools",      image: "/assets/hero/teaching.jpg",   link: "/district-65"    },
  { label: "Research in Reducing Hallucinations",   image: "/assets/hero/mudd.jpg", link: "/ai-research", sizes: [1280] },
  { label: "AI Engineer\nat Vitu" ,image: "/assets/hero/aiengineer.jpg",link: "/ai-engineer-at-vitu", sizes: [1280, 2560] },
  { label: "Tech Help for Seniors",        image: "/assets/hero/seniorcenter.jpg",     link: "/tech-help"      },
  { label: "First Attempts at Making Music",         image: "/assets/hero/music.jpg",      link: "/music", sizes: [1280] },
  { label: "Blog\n(Coming Soon)",          image: "/assets/hero/travel.jpg",       link: "/blog", sizes: [1280] },
  { label: "Model UN",      image: "/assets/hero/mun.jpg",        link: "/model-un", sizes: [1280, 2560] },
  { label: "A Game Called Unipsycho",         image: "/assets/hero/unipsycho.png",      link: "/unipsycho"       },
  { label: "A Game Called Squingo",         image: "/assets/hero/squingo.png",      link: "/squingo", sizes: [1280] },
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

/**
 * The widest a card image is ever drawn on this screen, in real pixels: about
 * one screen width (a card at the near side of the ring, or a full-width card
 * in the phone list).
 */
export const cardImageWidth = () =>
  Math.ceil(window.innerWidth * Math.min(window.devicePixelRatio || 1, 3));

/**
 * The smallest copy of a card's image that is still at least as sharp as this
 * screen can show, or the original if no copy is big enough. Several originals
 * are 11-17 megapixels, which is slow to decode and draw and never visible.
 */
export function cardImage(card: CardData, neededWidth = cardImageWidth()): string {
  const width = card.sizes?.find((w) => w >= neededWidth);
  if (!width) return card.image;
  const dot = card.image.lastIndexOf(".");
  const name = card.image.slice(card.image.lastIndexOf("/") + 1, dot);
  return `/assets/hero/sized/${name}-${width}${card.image.slice(dot)}`;
}

/**
 * For project pages that show their card's picture: the same file the
 * carousel used on this screen, so it is already downloaded when the page
 * opens.
 */
export function heroImage(image: string): string {
  const card = cards.find((c) => c.image === image);
  return card ? cardImage(card) : image;
}
