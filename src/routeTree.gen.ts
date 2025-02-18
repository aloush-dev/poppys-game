/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PlayImport } from './routes/play'
import { Route as ExploreImport } from './routes/explore'
import { Route as CreateImport } from './routes/create'
import { Route as LayoutImport } from './routes/_layout'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const PlayRoute = PlayImport.update({
  id: '/play',
  path: '/play',
  getParentRoute: () => rootRoute,
} as any)

const ExploreRoute = ExploreImport.update({
  id: '/explore',
  path: '/explore',
  getParentRoute: () => rootRoute,
} as any)

const CreateRoute = CreateImport.update({
  id: '/create',
  path: '/create',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/create': {
      id: '/create'
      path: '/create'
      fullPath: '/create'
      preLoaderRoute: typeof CreateImport
      parentRoute: typeof rootRoute
    }
    '/explore': {
      id: '/explore'
      path: '/explore'
      fullPath: '/explore'
      preLoaderRoute: typeof ExploreImport
      parentRoute: typeof rootRoute
    }
    '/play': {
      id: '/play'
      path: '/play'
      fullPath: '/play'
      preLoaderRoute: typeof PlayImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof LayoutRoute
  '/create': typeof CreateRoute
  '/explore': typeof ExploreRoute
  '/play': typeof PlayRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof LayoutRoute
  '/create': typeof CreateRoute
  '/explore': typeof ExploreRoute
  '/play': typeof PlayRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_layout': typeof LayoutRoute
  '/create': typeof CreateRoute
  '/explore': typeof ExploreRoute
  '/play': typeof PlayRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/create' | '/explore' | '/play'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/create' | '/explore' | '/play'
  id: '__root__' | '/' | '/_layout' | '/create' | '/explore' | '/play'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  LayoutRoute: typeof LayoutRoute
  CreateRoute: typeof CreateRoute
  ExploreRoute: typeof ExploreRoute
  PlayRoute: typeof PlayRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LayoutRoute: LayoutRoute,
  CreateRoute: CreateRoute,
  ExploreRoute: ExploreRoute,
  PlayRoute: PlayRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_layout",
        "/create",
        "/explore",
        "/play"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_layout": {
      "filePath": "_layout.tsx"
    },
    "/create": {
      "filePath": "create.tsx"
    },
    "/explore": {
      "filePath": "explore.tsx"
    },
    "/play": {
      "filePath": "play.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
