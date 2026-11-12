// src/utils/dom.ts

/**
 * An element's top edge in document coordinates, from layout alone. Unlike
 * getBoundingClientRect() it ignores transforms, so it is right even while the
 * element (or an ancestor) is mid-slide in a page transition.
 */
export function pageTop(el: HTMLElement): number {
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}
