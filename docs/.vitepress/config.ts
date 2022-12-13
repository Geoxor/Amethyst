import {defineConfig} from "vitepress";

export default defineConfig({ 
  title: "Amethyst",
  description: "Amethyst Documentation",
  lang: 'en-US',
  appearance: "dark",
  themeConfig: {

    editLink: {
      pattern: 'https://github.com/Geoxor/amethyst/tree/master/docs/:path'
    },
    siteTitle: "Amethyst",
    logo: "https://raw.githubusercontent.com/Geoxor/amethyst/master/assets/icon.svg",
    sidebar: [{
      text: 'Installation',
      items: [
        { text: 'Package Managers', link: '/installation/package_managers' },
        { text: 'Build from Source', link: '/installation/build_from_source' },
      ]
    },
    {
      text: 'Audio Nodes',
      collapsible: true,
      items: [
        { text: "Gain Node", link: "/nodes/gain_node"},
        { text: "Filter Node", link: "/nodes/filter_node"},
        { text: "Panner Node", link: "/nodes/panner_node"},
        { text: "Input Node", link: "/nodes/input_node"},
        { text: "Master Node", link: "/nodes/master_node"},
        { text: "Output Node", link: "/nodes/output_node"},
        { text: "Spectrum Node", link: "/nodes/spectrum_node"} 
      ]
    }]
  }
})