import React from 'react'
import PropTypes from 'prop-types'

import { Helmet } from 'react-helmet'

import { componentWithName } from '@tds/util-prop-types'

import safeRest from '../../shared/utils/safeRest'

import Item from './Item/Item'

import styles from './Breadcrumbs.modules.scss'

const omitProps = ({
  current,
  path,
  breadcrumbName,
  reactRouterLinkComponent,
  indexRoute,
  childRoutes,
  component,
  ...props
}) => props
const getBreadcrumbName = (item, params) => {
  if (!item.breadcrumbName) {
    return null
  }
  let breadcrumbName = item.breadcrumbName
  Object.keys(params).forEach(key => {
    breadcrumbName = breadcrumbName.replace(`:${key}`, params[key])
  })
  return breadcrumbName
}

const getPath = (path, params, concatenatePaths, paths) => {
  let p = path
  if (concatenatePaths) {
    p = p.replace(/^\//, '')
    Object.keys(params).forEach(key => {
      p = p.replace(`:${key}`, params[key])
    })
    if (p) {
      paths.push(p)
    }
    return `/${paths.join('/')}`
  }
  return p
}

const getItems = (items, params, concatenatePaths) => {
  const paths = []
  return items.filter(item => item.path).map((item, i, filteredItems) => {
    const isLast = i === filteredItems.length - 1
    const breadcrumbName = getBreadcrumbName(item, params)
    const href = getPath(item.path, params, concatenatePaths, paths)
    return {
      breadcrumbName,
      href,
      current: isLast,
      ...omitProps(safeRest(item)),
    }
  })
}

const getStructuredData = (items, baseUrl) => {
  return items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@id': `${baseUrl || ''}${item.href}`,
      name: item.breadcrumbName,
    },
  }))
}

/**
 * Display a hierarchy of links, commonly used for navigation.
 *
 * @version ./package.json
 */
const Breadcrumbs = ({
  routes,
  reactRouterLinkComponent,
  params = {},
  baseUrl,
  children,
  ...rest
}) => {
  let items
  if (children) {
    items = React.Children.toArray(children).map(
      ({ props: { href, children: breadcrumbName, ...itemRest } }) => ({
        path: href,
        breadcrumbName,
        ...itemRest,
      })
    )
  } else {
    items = routes.filter(route => route.path && route.breadcrumbName)
  }
  items = getItems(items, params, !children)
  const structuredData = getStructuredData(items, baseUrl)

  return (
    <nav {...safeRest(rest)}>
      <ol className={styles.list}>
        {items.map(({ href, current, breadcrumbName, ...itemRest }) => (
          <Item
            {...itemRest}
            key={href}
            href={href}
            reactRouterLinkComponent={reactRouterLinkComponent}
            current={current}
          >
            {breadcrumbName}
          </Item>
        ))}
      </ol>
      <Helmet>
        <script type="application/ld+json">
          {`
{
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": ${JSON.stringify(structuredData)}
}
`}
        </script>
      </Helmet>
    </nav>
  )
}

Breadcrumbs.propTypes = {
  /**
   * An array of routes to be displayed as breadcrumbs.
   */
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      breadcrumbName: PropTypes.string,
    })
  ),
  /**
   * Base URL used to build structured data.
   */
  baseUrl: PropTypes.string,
  /**
   * React Router Link component.
   */
  reactRouterLinkComponent: PropTypes.func,
  /**
   * React Router params.
   */
  params: PropTypes.object,
  /**
   * A list of Items to be used as an alternative to the `routes` prop.
   */
  children: componentWithName('Item'),
}

Breadcrumbs.defaultProps = {
  routes: undefined,
  baseUrl: undefined,
  reactRouterLinkComponent: undefined,
  params: {},
  children: undefined,
}

Breadcrumbs.Item = Item

export default Breadcrumbs
