export function toBin(num,len){
    let str = Number(num).toString(2)
    while(len-str.length!==0){
        str='0'+str
    }
    return str
}
export function strCount(str, char){
    let c=0
    for(let i=0;i<str.length;i++){
        if(str[i]===char){
            c++
        }
    }
    return c
}
export function strFind(str, char, entry) {
    entry%=str.length+1
    let i=-1
    while(entry && i!==str.length){
        i++
        if(str[i]===char){
            entry--
        }
    }
    return Number(entry!==0?-1:i)
}