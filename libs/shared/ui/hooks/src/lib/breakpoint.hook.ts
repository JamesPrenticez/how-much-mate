const size = {
    mobile: '768px',
    tablet: '1024px',
};

export const device = {
    mobile: `(max-width: ${size.mobile}) and (orientation : portrait)`,
    tablet: `(max-width: ${size.tablet}) and (orientation : portrait)`,
    mobileLandscape: `(max-width: ${size.mobile}) and (orientation : landscape)`,
    tabletLandscape: `(max-width: ${size.tablet}) and (orientation : landscape)`,
};