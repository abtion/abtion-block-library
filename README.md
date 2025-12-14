# Abtion Block Library

Abtion Block Library is a WordPress plugin that provides a collection of custom blocks for the block editor.

## Blocks

### Tabs

The Tabs block allows you to create tabbed content areas within your posts or pages. You can add multiple tabs, each containing its own content, and users can switch between them by clicking on the tab headers.

### Accordions

The Accordion block enables you to create collapsible content sections. Each section can be expanded or collapsed by clicking on the header, allowing you to organize content in a compact and user-friendly manner. Additional options include setting the initial state (expanded or collapsed) and customizing the appearance of the accordion headers.

### Trustpilot

The Trustpilot block allows you to display Trustpilot reviews directly on your website. You can customize the appearance of the reviews and choose how many reviews to show.

### Slider

The Slider block supports multiple slider types like normal slider, continuous marquee slider and vertical slider. You can add blocks as slides and and customize settings like number of slides per view.

### Multi Switch Panel

The Multi Switch Panel block allows you to create a panel with multiple switchable sections. Each section can contain different content, and users can switch between them using tabs or buttons.

## Development

To start with development, clone the repository and set up a local WordPress environment. Then, follow these steps:

1. Navigate to the plugin directory:

```bash
cd abtion-block-library
```

2. Install the required dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Publishing a new version

After making changes to the library, you must build the updated assets and publish a new version so downstream projects (for example those installing via Composer) can pull the latest release.

Follow these steps:

1. Make your changes and run the build to generate updated assets:

   ```bash
   npm run build
   ```

   Ensure the `build/` folder contains the latest output.

2. Bump the plugin version in `abtion-block-library.php`.

3. Update the same version number in `package.json`.

4. Add an entry to `CHANGELOG.md` describing the changes.

5. Commit and push your changes to the repository.

6. Create a Git tag for the new version (run from the repository root):

   ```bash
   git tag v1.1.0
   ```

   Replace `v1.1.0` with the version you set in `abtion-block-library.php`.

7. Push the tag to GitHub:

   ```bash
   git push origin v1.1.0
   ```

Once the tag is pushed, package managers such as Composer will be able to resolve and install the new version.

### Versioning rules

This project follows semantic versioning in the format:

```
MAJOR.MINOR.PATCH
```

Use the following guidelines when bumping the version:

- **PATCH** (`1.1.0 → 1.1.1`)  
  Bug fixes, internal refactors, build changes, or documentation updates that do not affect public APIs or block behavior.

- **MINOR** (`1.1.0 → 1.2.0`)  
  New blocks, new features, new block attributes, or backward-compatible improvements to existing blocks.

- **MAJOR** (`1.x.x → 2.0.0`)  
  Breaking changes such as:
  - removing or renaming blocks
  - changing block markup or attributes in a non-backward-compatible way
  - removing public APIs or expected behaviors

Always ensure that:

- the version in `abtion-block-library.php`
- the version in `package.json`
- the Git tag

all match exactly.

Update `CHANGELOG.md` for every release, even if the change is small.
