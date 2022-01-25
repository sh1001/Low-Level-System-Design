import { obj } from "./Types"

interface choice {
    name: string,
    value: string
}

export const getChoiceArrayFromObject = (obj: obj) : choice[] => {
    let choiceArray: choice[] = []
    for (let key in obj) {
        choiceArray.push({ name: `${key} (${obj[key]})`, value: key })
    }
    return choiceArray
}