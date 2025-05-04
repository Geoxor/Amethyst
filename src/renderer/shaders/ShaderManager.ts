import {amethyst} from "@/amethyst";

export class ShaderManager {

  private shaders: Map<string, string>;

  public constructor() {
    this.shaders = new Map();
    //@ts-ignore
    const shaderModules = import.meta.glob<{ default: {name: string, glsl: string} }>("@/shaders/builtin/*.ts", {eager: true});
    Object.entries(shaderModules).forEach(([path, module]) => {
      try {
        //@ts-ignore
        const shader = module.default;
        if (!shader) throw new Error("Shader module did not export a default export");
        if (!shader.name || !shader.glsl) throw new Error("Shader module did not export a name or glsl property");
        this.registerBuiltinShader(shader.name, shader.glsl);
      } catch (error) {
        console.error(`Failed to load shader ${path}: ${error}`);
      }
    });
  }

  public registerBuiltinShader(name: string, glsl: string) {
    this.registerShader("builtin/" + name, glsl);
  };

  public registerShader(name: string, glsl: string) {
    this.shaders.set(name, glsl);
  };

  public getShader(name: string): string {
    return this.shaders.get(name) || `
      void main() {
        gl_FragColor = vec4(0.0);
      }
    `;
  }

  public getSelectedShader(): string {
    return this.getShader(amethyst.state.settings.value.shader.selected);
  }

  public getShaderNames(): string[] {
    return Array.from(this.shaders.keys());
  }
}