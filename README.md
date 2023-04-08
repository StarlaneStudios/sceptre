<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/StarlaneStudios/sceptre/main/.github/logo.svg" height="164">
</p>

# Sceptre

Implement Next.js style page directories in your single page application by generating routing definitions from a page directory.

## Installation

Install the CLI

```
npm install -g sceptre
```

## Page folder structure

Pages are defined using a folder structure in your application. Subfolders denote path segments, while pages map to `index.tsx` or `index.jsx` files. When using sceptre, each page is given it's own directory in which assets and styles can be placed, allowing for a clean and structured page setup.

## Exporting pages

Each page is expected to contain a default export of it's `RouteObject`. The `path` property will automatically be populated when parsing the tree, so it may be omitted.

```tsx
function IndexPage() {
    return (
        <div>
            Page content
        </div>
    )
}

export default {
    element: <IndexPage />
};
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
```bash
sceptre ./src/pages/**/index.tsx ./src/generated/routes.ts --base ./src/pages
```

This command will compile all index components placed recursively within the pages directory and generates a routes.ts.

### Base directory
The `--base` flag should point to the directory containing all pages. By default it is set to the current execution directory.

### Identing
You can optionally pass `--indent none | tab | <number>` to control the indentation of the generated routing configuration. By default indentation is disabled.

### Forced js extensions
Certain environments may require all script file imports to end with `.js` regardless of their actual extension. In this case you can pass the `--force-js` flag.

## Vindigo

This package was originally developed for use in [Vindigo](https://github.com/StarlaneStudios/vindigo), a free and open source task planner.

## License

sceptre is licensed under [MIT](https://github.com/StarlaneStudios/sceptre/blob/main/LICENSE)

Copyright (c) 2022-present, [Starlane Studios](https://starlane.studio/)
