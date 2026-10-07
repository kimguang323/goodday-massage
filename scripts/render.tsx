import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { SiteRoutes } from '../src/Routes'
export { getPageInfo, staticPaths, cityEntries, SITE_URL } from '../src/data/site'
export function render(path: string) {
  return renderToString(<StaticRouter location={path}><SiteRoutes /></StaticRouter>)
}
