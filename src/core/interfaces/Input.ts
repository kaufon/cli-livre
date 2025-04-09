export interface IInput{
  textInput(message:string): Promise<string>
  numberInput(message:string): Promise<number>
  selectInput(message:string,choices: string[][]):Promise<string>


}
