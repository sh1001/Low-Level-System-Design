import { obj } from "./Types"
import { Denominations } from "./Variables"

export default class Collection {
    availableCoins: obj
    totalCollection: number

    constructor() {
        this.availableCoins = Object.keys(Denominations).reduce((acc: obj, item: string) :obj => {
            acc[item] = 0
            return acc
        }, {})
        this.totalCollection = 0
    }

    add(coin: string) {
        this.availableCoins[coin] += 1
        this.totalCollection += Denominations[coin]
    }

    mergeCollection(collection: Collection) {
        this.totalCollection += collection.totalCollection
        for(let key in collection.availableCoins) {
            this.availableCoins[key] += collection.availableCoins[key]
        }
    }
}