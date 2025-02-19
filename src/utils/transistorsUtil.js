import { strCount } from "./strUtil"

export function countTransistors(normal_form, is_disjunctive) {
    let negatives = []
    let negated = is_disjunctive ? '0' : '1'
    let count = 0
    for (let i=0; i < normal_form.length; i++) {
        let term = normal_form[i]
        for (let j=0; j < term.length; j++) {
            let char = term[j]
            if (char == negated && negatives.find((negIdx) => negIdx == j) == undefined) {
                negatives.push(j)
            }
        }
        let varCount = term.length - strCount(term, '*') - 1
        if (varCount > 1) {
            count += varCount
        }
    }
    if (normal_form?.length > 1) {
        count += normal_form.length
    }
    return count + negatives.length
}