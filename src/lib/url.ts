// Links that work at the domain root and under a base path (GitHub Pages).
const root = import.meta.env.BASE_URL.replace(/\/$/, '');

// url('/about/') -> '/about/' or '/markdown-to-pdf/about/'
export const url = (path = '/') => root + '/' + path.replace(/^\//, '');

// The page path without the base, for canonical links and nav highlighting.
export const routePath = (pathname: string) =>
  root && pathname.startsWith(root) ? pathname.slice(root.length) || '/' : pathname;

// True in the bingemind.com build (SITE_MODE=bingemind): the real public home, so indexable.
export const isBingemind = import.meta.env.SITE_MODE === 'bingemind';
