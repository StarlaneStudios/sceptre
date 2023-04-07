<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/StarlaneStudios/react-router-tree/main/.github/logo.svg" height="164">
</p>

# Sceptre

Implement Next.js style page directories in your single page application. Supports React projects created using [Vite](https://vitejs.dev/) or [CRA](https://create-react-app.dev/) (or any other webpack implementation).

## Installation

Install the package using NPM

```
npm install react-router-tree
```

## Page folder structure

Pages are defined using a folder structure in your application. Subfolders denote path segments, while pages map to `index.tsx` or `index.jsx` files. In react-router-tree, each page is given it's own directory, in which assets and styles can be placed, allowing for a clean and structured page setup.

## Exporting pages

Each page is expected to contain a default export of it's `RouteObject`. For TypeScript users a `defineRoute` helper function is included. The `path` property will automatically be populated when parsing the tree, so it may be omitted.

```tsx
import { defineRoute } from "react-router-tree";

function IndexPage() {
	return (
		<div>
			Page content
		</div>
	)
}

export default defineRoute({
	element: <IndexPage />
});
```

### URL Parameters

Parameters can be defined by using `[name]` as folder name. This will automatically translate into `:name` when building routes.

We also support a other parameter type: `...` which will match any path segment.

### Index mapping

Folders named `@` will map to the index page of the parent directory.

### Parent pages

You can add a parent pages by making a folder named `_` anywhere in your file tree. Parent pages are responsible for placing an `<Outlet />` where child routes will be rendered. Routes can be parented any number of times, each rendering in its closest parent outlet.

Visual example:
```
/example/_				- Responsible for rendering outlet 1
/example/@				- Rendered inside outlet 1
/example/page/_			- Rendered inside outlet 1 and responsible for rendering outlet 2
/example/page/@			- Rendered inside outlet 2
/example/page/child 	- Rendered inside outlet 2
```

## Alternative paths

The route object returned from a page allows defining a list of alternative routes that can be used to reach the page. These alternative paths are relative to the route itself and share the same meta.

Example:
```tsx
export default defineRoute({
	element: <HelpPage />,
	alternatives: [
		{ path: 'instructions' },
		{ path: 'sub/path/:param' }
	]
});
```

### Example folder structure

```
pages/
	@/
		index.tsx
		styles.tsx
	help/
		index.tsx
		style.scss
	settings/
		_/
			index.tsx
		overview/
			index.tsx
		[param]/
			index.tsx
	folder/
		_/
			index.tsx
		[...]/
			index.tsx
			style.scss
```

The above example translates to the given routes

```
/
/help
/settings/overview
/settings/:param
/folder/*
```

## Usage
```ts
// Using vite:
const pageTree: RouteTree = {
	prefix: './pages',
	routes: import.meta.glob('./pages/**/index.tsx', { eager: true })
};

// Using Create React App:
const pageTree: RouteTree = {
	prefix: './',
	routes: require.context('./pages/', true, /\index\.tsx$/)
};

// Combine page trees into a single array of routes
const routes = buildRouteObjects(pageTree);
```

## Example

An example implementation can be found [here](https://github.com/StarlaneStudios/react-router-tree/tree/main/example).

## Vindigo

This package was originally developed for use in [Vindigo](https://github.com/StarlaneStudios/vindigo), a free and open source task planner.

## License

react-router-tree is licensed under [MIT](https://github.com/StarlaneStudios/react-router-tree/blob/main/LICENSE)

Copyright (c) 2022-present, [Starlane Studios](https://starlane.studio/)
