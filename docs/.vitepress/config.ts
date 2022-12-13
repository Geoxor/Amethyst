import {defineConfig} from "vitepress";

export default defineConfig({ 
  title: "Amethyst",
  description: "Amethyst Documentation",
  lang: 'en-US',
  appearance: "dark",
  themeConfig: {
    footer: {
      message: "Made with the loss of multiple braincells 🧠"
    },
    socialLinks: [
      {
        link: "https://discord.gg/geoxor",
        icon: "discord"
      },
      {
        link: "https://github.com/Geoxor/amethyst",
        icon: "github"
      },
    ],
    editLink: {
      pattern: 'https://github.com/Geoxor/amethyst/tree/master/docs/:path'
    },
    siteTitle: "Amethyst",
    logo: "/icon.svg",
    nav: [
      { text: "Documentation", link: "/introduction" },
      { text: "Download", link: "/installation/package_managers"},
    ],
    sidebar: [
      {
        text: 'Installation',
        items: [
          { text: 'Package Managers', link: '/installation/package_managers' },
          { text: 'Build from Source', link: '/installation/build_from_source' },
        ]
      },
      {
        text: 'File Types',
        items: [
          { text: 'Amethyst Node Graph (.ang)', link: '/file_types/ang' },
          { text: 'Amethyst Metadata File (.amf)', link: '/file_types/amf' },
        ]
      },
      {
        text: 'Audio Nodes',
        collapsible: true,
        items: [
          { text: "<img align='left' src='/input_icon.svg' style='margin-right: 6px;' width='20'/> Input Node", link: "/nodes/input_node"},
          { text: "<img align='left' src='/master_icon.svg' style='margin-right: 6px;' width='20'/> Master Node", link: "/nodes/master_node"},
          { text: "<img align='left' src='/output_icon.svg' style='margin-right: 6px;' width='20'/> Output Node", link: "/nodes/output_node"},
          { text: "<img align='left' src='/filter_icon.svg' style='margin-right: 6px;' width='20'/> Filter Node", link: "/nodes/filter_node"},
        ]
      }
    ]
  }
})