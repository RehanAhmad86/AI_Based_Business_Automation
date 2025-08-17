declare module "brain.js" {
  export interface INeuralNetworkOptions {
    hiddenLayers?: number[]
    learningRate?: number
    iterations?: number
    errorThresh?: number
    activation?: string
  }

  export interface ITrainingData {
    input: number[] | { [key: string]: number }
    output: number[] | { [key: string]: number }
  }

  export class NeuralNetwork {
    constructor(options?: INeuralNetworkOptions)
    train(data: ITrainingData[], options?: any): any
    run(input: number[] | { [key: string]: number }): number[] | { [key: string]: number }
    toJSON(): any
    fromJSON(json: any): void
  }
}
