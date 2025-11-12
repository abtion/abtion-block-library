# Abtion Block Library

Abtion Block Library is a WordPress plugin that provides a collection of custom blocks for the block editor.

## Blocks

### Tabs

The Tabs block allows you to create tabbed content areas within your posts or pages. You can add multiple tabs, each containing its own content, and users can switch between them by clicking on the tab headers.

### Accordions

The Accordion block enables you to create collapsible content sections. Each section can be expanded or collapsed by clicking on the header, allowing you to organize content in a compact and user-friendly manner. Additional options include setting the initial state (expanded or collapsed) and customizing the appearance of the accordion headers.

### Trustpilot

The Trustpilot block allows you to display Trustpilot reviews directly on your website. You can customize the appearance of the reviews and choose how many reviews to show.

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

## Publishing new version

After updating the library, we need to build the new files with ```npm run build```. Then we need to bump the version and github tag the new version. This will ensure that package managers like composer that are being used on other projects will always pull the latest version of the library. To do that:

1. Make the changes and run ```npm run build``` to ensure the changes are saved in the build folder.

2. Update the plugin version in `abtion-block-library.php`.

3. Update changelog file `CHANGELOG.md` with relevant information.

4. Push the changes.

5. Tag new version in github: In the root of abtion block library run this command:

```bash
git tag v1.1.0
```

Replace the version in the command above with the actual updated version from `abtion-block-library.php` file.

6. Commit the updated file and push it by running the following:

```bash
git push origin v1.1.0
```


