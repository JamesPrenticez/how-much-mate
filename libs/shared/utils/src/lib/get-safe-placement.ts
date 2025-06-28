export type Placement = 'top' | 'bottom' | 'left' | 'right';

interface GetSafePlacementOptions {
  targetEl: HTMLElement;         // The element you want to position (e.g., tooltip, dropdown)
  referenceEl: HTMLElement;      // The anchor/trigger element
  containerEl?: HTMLElement;     // The bounding container (default: document.documentElement)
  preferredPlacement: Placement; // Your desired placement direction
  offset?: number;               // Minimum padding from the edge
}

export function getSafePlacement({
  targetEl,
  referenceEl,
  containerEl = document.documentElement,
  preferredPlacement,
  offset = 8,
}: GetSafePlacementOptions): Placement {
  const targetRect = targetEl.getBoundingClientRect();
  const referenceRect = referenceEl.getBoundingClientRect();
  const containerRect = containerEl.getBoundingClientRect();

  const fits = {
    top: referenceRect.top - targetRect.height - offset >= containerRect.top,
    bottom: referenceRect.bottom + targetRect.height + offset <= containerRect.bottom,
    left: referenceRect.left - targetRect.width - offset >= containerRect.left,
    right: referenceRect.right + targetRect.width + offset <= containerRect.right,
  };

  switch (preferredPlacement) {
    case 'top':
      return fits.top ? 'top' : fits.bottom ? 'bottom' : 'top';
    case 'bottom':
      return fits.bottom ? 'bottom' : fits.top ? 'top' : 'bottom';
    case 'left':
      return fits.left ? 'left' : fits.right ? 'right' : 'left';
    case 'right':
      return fits.right ? 'right' : fits.left ? 'left' : 'right';
    default:
      return preferredPlacement;
  }
}
