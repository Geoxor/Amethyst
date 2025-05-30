export interface ICommandDefinition {
  title: string, 
  action: () => void, 
  icon?: string
}

export const defineCommand = (title: string, action: () => void, icon?: string): ICommandDefinition => ({
  title,
  action,
  icon
})

export const registerCommand = (title: string, action: () => void, icon?: string) => {
  commands.push(defineCommand(title, action, icon));
};

export const commands: ICommandDefinition[] = []
