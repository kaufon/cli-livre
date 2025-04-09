import type { IInput } from "../../core/interfaces";
export class SellersCommands{
  private input: IInput;
  constructor(input: IInput){
    this.input = input
  }
  public async run():Promise<void>{
    const options = await this.input.selectInput("Pls escolha",[
      ["Cadastrar Vendedor","add"],
      ["Atualizar Vendedor","update"],
      ["Deletar Vendedor","delete"],
      ["Buscar Vendedor","search"],
      ["Voltar","exit"]
    ])
  }
}
