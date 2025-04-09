import type { IInput } from "../../core/interfaces";
export class ProductsCommands{
  private input: IInput;
  constructor(input: IInput){
    this.input = input
  }
  public async run():Promise<void>{
    const options = await this.input.selectInput("Pls escolha",[
      ["Cadastrar Produto","add"],
      ["Atualizar Produto","update"],
      ["Deletar Produto","delete"],
      ["Buscar Produto","search"],
      ["Voltar","exit"]
    ])
  }
}
