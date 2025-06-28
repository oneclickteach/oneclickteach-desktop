# oneclickteach-desktop
Desktop management application for OneClickTeach platform - empowers language teachers to easily configure, deploy and manage their teaching websites through a simple GUI interface


## Install and Developing

```bash
pnpm install
pnpm dev

```

## Building for Production

Build the application for your platform:

```bash
# For Windows
pnpm run build:win

# For macOS
pnpm run build:mac

# For Linux
pnpm run build:linux

# Unpacked for all platforms
pnpm run build:unpack
```

## IPC Communication

The app uses a secure IPC (Inter-Process Communication) system to communicate between the renderer and main processes:

```ts
// Renderer process (send message to main)
window.api.send('channel-name', ...args)

// Renderer process (receive message from main)
window.api.receive('channel-name', (data) => {
  console.log(data)
})

// Renderer process (invoke a method in main and get a response)
const result = await window.api.invoke('channel-name', ...args)
```

### Customizing Menu Items

To add, remove or modify menu items, update the `lib/window/titlebarMenus.ts` file.

## Tailwind Styling

The project supports **TailwindCSS** for styling:

```ts
// Example component with Tailwind classes
const Button = () => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
);
```

## Project Structure

<!-- prettier-ignore-start -->
```markdown
├── app/                        # Renderer process files
│   ├── assets/                 # Static assets (images, fonts, etc)
│   ├── components/             # React components
│   │   ├── App.tsx             # Application component
│   ├── styles/                 # CSS and Tailwind files
│   │   ├── app.css             # App stylesheet
│   │   └── tailwind.css        # Tailwind stylesheet
│   ├── index.html              # Entry HTML file
│   └── renderer.tsx            # Renderer process entry
├── lib/                        # Shared library code
│   ├── main/                   # Main process code
│   │   ├── index.ts            # Main entry point for Electron
│   │   └── ...                 # Other main process modules
│   ├── preload/                # Preload scripts for IPC
│   │   ├── index.ts            # Preload script entry
│   │   └── api.ts              # Exposed API for renderer
│   ├── welcome/                # Welcome kit components
│   └── window/                 # Custom window implementation
├── resources/                  # Build resources
├── .eslintrc                   # ESLint configuration
├── .prettierrc                 # Prettier format configuration
├── electron-builder.yml        # Electron builder configuration
├── electron.vite.config.ts     # Vite configuration for Electron
├── package.json                # Project dependencies and scripts
└── tsconfig.node.json          # Main process tsconfig
└── tsconfig.web.json           # Renderer process tsconfig

```
<!-- prettier-ignore-end -->
