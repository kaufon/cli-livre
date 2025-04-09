import inquirer from "inquirer";
import type { IInput } from "../../core/interfaces"; 

export class Input implements IInput{
  public async textInput(message: string): Promise<string> {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "value",
        message: message,
      },
    ]);
    return answer.value;
  }
  public async numberInput(message: string): Promise<number> {
    const answer = await inquirer.prompt([
      {
        type: "number",
        name: "value",
        message: message,
      },
    ]);
    return answer.value;
  }
  public async selectInput(
    message: string,
    choices: string[][],
  ): Promise<string> {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "value",
        message: message,
        choices: choices.map((option) => ({
          name: option[0],
          value: option[1] ?? option[0],
        })),
      },
    ]);
    return answer.value;
  }
}
