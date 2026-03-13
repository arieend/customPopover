---
name: sfdx-scaffolder
description: Organizing flat LWC projects into standard Salesforce DX (SFDX) structures. Use when converting standalone LWC files into deployable SFDX projects with proper configuration for deployment and unit testing.
---

# SFDX Scaffolder

Transform flat LWC code into professional, deployable, and testable Salesforce projects.

## Core Workflows

### 1. Structure Reorganization
Move from a "flat" structure to the SFDX standard:
1.  Create the standard path: `force-app/main/default/lwc/`.
2.  Move component files into a nested directory: `lwc/<component-name>/`.
3.  Organize assets (images, docs) into a top-level `docs/` folder.

### 2. Mandatory Configuration
Always generate these files to ensure environment stability:
1.  **`sfdx-project.json`**: Define standard package directories and the `sourceApiVersion`.
2.  **`jsconfig.json`**: Essential for VS Code IntelliSense. Include standard LWC path mappings.
3.  **`.gitignore`**: Filter out `.sfdx/`, `.sf/`, `node_modules/`, and OS-specific temporary files.

### 3. Testing Readiness
Set up the `sfdx-lwc-jest` environment:
1.  Initialize `package.json` if missing.
2.  Add a `test:unit` script pointing to `sfdx-lwc-jest`.
3.  Create a `__tests__` directory within the LWC component folder.
4.  Scaffold a basic Jest test file following LWC patterns.

## References

*   See `references/standard-gitignore.md` for a complete, pre-configured list of ignore patterns.
*   See `references/jsconfig-template.md` for the base VS Code configuration.
*   See `references/sfdx-project-template.md` for the core project metadata structure.
