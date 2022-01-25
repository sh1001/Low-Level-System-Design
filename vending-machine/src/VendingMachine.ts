import inquirer from "inquirer"
import Collection from "./Collection"
import { getChoiceArrayFromObject } from "./Util"
import { Denominations, Menu } from "./Variables"

enum State {
    READY,
    SHOWING_MENU,
    COLLECTING_MONEY,
    CHECKING_FOR_CHANGE,
    DISPENCING_ITEM,
    DISPENCING_MONEY,
    CANCELLING
}

export default class VendingMachine {
    private collection: Collection
    private tempCollection: Collection
    state: State
    selectedChoice: string

    constructor() {
        this.state = State.READY
        this.collection = new Collection()
        this.tempCollection = new Collection()
        this.selectedChoice = '#'
    }

    start() {
        this.state = State.SHOWING_MENU
        console.log('Hello there!!! Wanna buy a drink?')
        inquirer.prompt([
            {
                name: 'choice',
                message: 'Choice one from the available Drinks...',
                type: 'list',
                choices: [...getChoiceArrayFromObject(Menu), {name: 'abort', value: 'abort'}]
            }
        ]).then(answer => {
            if(answer.choice === 'abort') {
                this.abort()
            } else {
                this.selectedChoice = answer.choice
                this.collectMoney()
            }
        })
    }

    private async collect() {
        let answer = await inquirer.prompt([
            {
                name: 'choice',
                message: `Please Pay $${Menu[this.selectedChoice] - this.tempCollection.totalCollection}`,
                type: 'list',
                choices: [...getChoiceArrayFromObject(Denominations), {name: 'abort', value: 'abort'}]
            }
        ])

        return answer.choice
    }

    private async collectMoney() {
        this.state = State.COLLECTING_MONEY
        while(this.tempCollection.totalCollection < Menu[this.selectedChoice]) {
            let choice = await this.collect()
            if(choice === 'abort') {
                this.abort()
                break
            } else {
                this.tempCollection.add(choice)
            }
        }
        this.checkForChange()
    }

    private checkForChange() {
        this.state = State.CHECKING_FOR_CHANGE
        if(this.tempCollection.totalCollection === Menu[this.selectedChoice]) {
            this.dispenseItem()
        } else {
            // need to implement this
        }
    }

    private dispenseItem() {
        this.state = State.DISPENCING_ITEM
        console.log(`Here is your ${this.selectedChoice}. Enjoy and have a great day...`)

        this.collection.mergeCollection(this.tempCollection)
        this.tempCollection = new Collection()
        this.selectedChoice = '#'
        this.state = State.READY

        this.start()
    }

    private abort() {
        if(this.state === State.COLLECTING_MONEY) {
            if(this.tempCollection.totalCollection !== 0) {
                console.log(`Dispensing collected money of ${this.tempCollection.totalCollection}`)
            }
            console.log(`Have a nice day. See you soon...`)
            this.tempCollection = new Collection()
            this.selectedChoice = '#'
            this.state = State.READY
        }
    }
}