import { MercadoLivreSystem } from "./app/Main";

export const App = async () => {
  const app = new MercadoLivreSystem()
  console.log("Inicando app..")
  await app.init()
  await app.run()
  console.log("App correndo...")
}
App()
