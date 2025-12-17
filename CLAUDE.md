# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website repository for St Columba's Free Church (stcolumbas.freechurch.org). It uses a custom Python-based static site generator with Netlify CMS for content management, Netlify Functions for server-side operations (giving/donations via Stripe), and Tailwind CSS for styling.

## Key Architecture

### Static Site Generation Pipeline

The site uses a custom static site generator written in Python:

1. **Content Source**: YAML files in `src/` define page content and metadata
2. **Templates**: Jinja2 templates in `templates/` define HTML structure
3. **Build Process**: `build.py` orchestrates the generation:
   - Loads YAML content from `src/`
   - Renders through Jinja2 templates
   - Generates static HTML in `dist/`
   - Creates service worker manifest with content hashes
   - Generates sitemap.xml

### Content Structure

- **src/**: Page content as YAML files (e.g., `src/index.yml`, `src/about/our-team.yml`)
  - Each YAML file specifies a `layout` (maps to template name)
  - Content can include various block types (text_text_row, team_list, activities_list, etc.)
- **templates/**: Jinja2 HTML templates with blocks in `templates/blocks/`
- **static/**: Static assets (images, icons, etc.) copied to `dist/static/`
- **public/**: Files copied directly to `dist/` root
- **dist/**: Generated output directory (excluded from git)

### Rendering System

The rendering logic in `static_gen/render.py` provides:

- Custom Jinja2 filters and functions for content rendering
- Block rendering functions (render_team_list, render_activities_list, etc.)
- Image processing: WebP conversion, responsive resizing, content hashing
- Markdown support via mistune
- The `render_content()` function dispatches to specific block renderers based on `type_` field

### Frontend Assets

- **CSS**: Tailwind CSS configured in `assets/tailwind.config.js`, built via PostCSS
- **JavaScript**: Webpack builds from `assets/src/` to `static/js/`
- **NetlifyCMS**: Admin interface for content editing (typically at `/admin`)

### Netlify Functions

Serverless functions in `assets/src/netlify_functions/` (e.g., `get_checkout_session.js`) handle backend operations like Stripe payment integration.

## Development Commands

### Initial Setup
```bash
make dev-setup
```
Sets up Python virtual environment and installs Node dependencies.

### Building
```bash
make build           # Full build of the site
make ci              # CI build (includes JS, CSS, functions)
```

### Development Server
```bash
make serve           # Starts development server with live reload on port 4001
                     # Watches templates/, src/, public/, assets/ for changes
```

### Asset Building
```bash
make js-build        # Build JavaScript with webpack (production)
make js-watch        # Build JavaScript with webpack in watch mode
make css-build       # Build Tailwind CSS
make css-watch       # Build CSS in watch mode
```

### Other Tasks
```bash
make py-format       # Format Python code with black
make netlify-functions        # Build Netlify Functions for deployment
make local-netlify-functions  # Run Netlify Functions locally
```

## Requirements

- Python 3.7+
- Node.js and Yarn
- `make` and `entr` (for file watching)

Python dependencies are managed via pip-tools:
- `requirements.txt` for production
- `requirements_dev.txt` for development

## Deployment

Hosted on Netlify. Build command configured in `netlify.toml`:
```bash
make ci-setup ci
```

This installs dependencies and builds the site including assets and serverless functions.

## Image Processing

The static generator includes sophisticated image handling:
- Automatic WebP conversion with caching in `.image_cache/`
- Responsive image resizing (multiple breakpoints)
- Content-based hash naming for cache busting
- SVG inline embedding support

## Service Worker

A service worker (`templates/sw.js`) is generated during build with a manifest of all pages and assets, using content hashes for cache versioning.
