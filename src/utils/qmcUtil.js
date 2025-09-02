import {strCount, strFind, toBin} from "@/utils/strUtil";
export function getDNF(props){
    let fun = []
    for(let i=0;i<2**props.funLen;i++){
        if(props.chose==='Σ()' || props.chose==='Σ() + X()'){
            if(props.funItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'+')
            }else if(props.xfunItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'-')
            }
        }
        if(props.chose==='Π()' || props.chose==='Π() + X()'){
            if(props.xfunItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'-')
            }else if(!props.funItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'+')
            }
        }
    }
    return fun
}
export function getKNF(props){
    let fun = []
    for(let i=0;i<2**props.funLen;i++){
        if(props.chose==='Σ()' || props.chose==='Σ() + X()'){
            if(props.xfunItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'-')
            }else if(!props.funItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'+')
            }
        }
        if(props.chose==='Π()' || props.chose==='Π() + X()'){
            if(props.funItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'+')
            }else if(props.xfunItems.includes(i)){
                fun.push(toBin(i,props.funLen)+'-')
            }
        }
    }
    return fun
}
export function getMNF(props,fun,type){
    if(fun.length===2**props.funLen){
        let str=''
        for(let i=0;i<props.funLen;i++){
            str+='*'
        }
        str+='+'
        return [str]
    }
    for(let i=0;i<props.funLen;i++){
        fun = rangeNF(props,fun,type)
        let flag = mergibleAll(props,fun)
        fun = mergeAll(props,fun)
        if(!flag){
            break
        }
    }
    return fun
}
export function prevFunMDNF(props,fun,begin,end,prefix1,suffix1,prefix2,suffix2,sep1,sep2){
    let buffStr = ''
    for(let i=0;i<props.funLen;i++){
        buffStr+='*'
    }
    if(fun.length===0){
        return '0'
    }else if(fun[0].startsWith(buffStr)){
        return '1'
    }
    return prevFun(props,fun,begin,end,prefix1,suffix1,prefix2,suffix2,sep1,sep2)
}
export function prevFunMKNF(props,fun,begin,end,prefix1,suffix1,prefix2,suffix2,sep1,sep2){
    let buffStr = ''
    for(let i=0;i<props.funLen;i++){
        buffStr+='*'
    }
    if(fun.length===0){
        return '1'
    }else if(fun[0].startsWith(buffStr)){
        return '0'
    }
    return prevFun(props,fun,begin,end,prefix1,suffix1,prefix2,suffix2,sep1,sep2)
}
function prevFun(props,fun,begin,end,prefix1,suffix1,prefix2,suffix2,sep1,sep2){
    let str=begin
    for(let i=0;i<fun.length;i++){
        for(let j=0;j<fun[i].length-1;j++){
            if(fun[i][j]==='0'){
                str+=prefix1+String(props.funLen-1-j)+suffix1+(j===fun[i].length-2?'':sep1)
            }else if(fun[i][j]==='1'){
                str+=prefix2+String(props.funLen-1-j)+suffix2+(j===fun[i].length-2?'':sep1)
            }
        }
        if(str.endsWith(sep1)){
            str=str.substring(0,str.length-sep1.length)
        }
        str+=i===fun.length-1?'':sep2
    }
    str+=end
    return str
}
export function doPetrick(props,fun,type){
    let impKNF = []
    let resFun = []
    let normFun
    if(type==='DNF'){
        normFun = getDNF(props)
    }else if(type==='KNF'){
        normFun = getKNF(props)
    }
    for(let i=0;i<normFun.length;i++){
        if(normFun[i].endsWith('-')){
            continue
        }
        let terms=''
        for(let j=0;j<fun.length;j++){
            if(mergible(fun[j],normFun[i])){
                terms+='0'
            }else{
                terms+='*'
            }
        }
        terms+='+'
        impKNF.push(terms)
    }
    for(let i=0;i<2**fun.length;i++){
        impKNF = mergeAllHard(impKNF,fun)
    }
    let graph = graphRec(impKNF)
    let arr = []
    let minTermsSum = Number. MAX_SAFE_INTEGER
    let minTerms = []
    graphSimplify(graph,arr)
    for(let i=0;i<arr.length;i++){
        let usedTerms = []
        for(let j in arr[i]){
            if(!usedTerms.includes(arr[i][j])){
                usedTerms.push(arr[i][j])
            }
        }
        arr[i]=usedTerms.slice()
    }
    for(let i=0;i<arr.length;i++){
        let sum= arr[i].length-1
        for(let j in arr[i]){
            sum+=strCount(fun[arr[i][j]],'0')+strCount(fun[arr[i][j]],'1')-1
        }
        if(sum<minTermsSum){
            minTermsSum=sum
            minTerms=arr[i].slice()
        }
    }
    for(let i=0;i<minTerms.length;i++){
        resFun.push(fun[minTerms[i]])
    }
    return resFun
}
function graphRec(impKNF,depth=0){
    if(depth >= impKNF.length){
        return -1
    }
    let resGraph = {}
    let currTerm = impKNF[depth]
    depth++
    for(let i=0;i<strCount(currTerm,'0');i++){
        let indexO = strFind(currTerm,'0',i+1)
        resGraph[indexO]=graphRec(impKNF,depth)
    }
    return resGraph
}
function graphSimplify(graph,outputArr,depth=0,currTerm=[]){
    depth++
    if(graph !== -1){
        for(let key in graph){
            if(currTerm.length>=depth){
                currTerm.splice(depth-1,currTerm.length-depth+1)
            }
            currTerm.push(key)
            if(graphSimplify(graph[key],outputArr,depth,currTerm)===-1){
                outputArr.push(currTerm.slice())
            }
        }
    }else{
        return -1
    }
}
function mergeAllHard(fun){
    let res = []
    let frl = []
    for(let i=0;i<fun.length;i++){
        frl.push(0)
    }
    for(let i=0;i<fun.length-1;i++){
        for(let j=i+1;j<fun.length;j++){
            if(mergible(fun[i],fun[j]) && !res.includes(merge(fun[i],fun[j]))){
                res.push(merge(fun[i],fun[j]))
                frl[i]=1
                frl[j]=1
            }
        }
    }
    for(let i=0;i<fun.length;i++){
        if(frl[i]===0){
            res.push(fun[i])
        }
    }
    return res
}
function rangeNF(props, funList, type) {
    let fun = []
    for(let i=0;i<=props.funLen;i++){
        fun.push([])
        for(let j=0;j<funList.length;j++){
            if(strCount(funList[j],type==='DNF'?'1':'0')===i){
                fun[i].push(funList[j])
            }
        }
    }
    return fun
}
function mergeAll(props, funRangedList){
    let fun = []
    let frl = []
    for(let i=0;i<=props.funLen;i++){
        frl.push([])
        for(let j=0;j<funRangedList[i].length;j++){
            frl[i].push(0)
        }
    }
    for(let i=0;i<props.funLen;i++){
        for(let j=0;j<funRangedList[i].length;j++){
            for(let k=0;k<funRangedList[i+1].length;k++){
                if(mergible(
                    funRangedList[i][j],
                    funRangedList[i+1][k],
                )){
                    let buffStr = merge(
                        funRangedList[i][j],
                        funRangedList[i+1][k],
                    )
                    if(!fun.includes(buffStr)){
                        fun.push(buffStr)
                    }
                    frl[i][j] = 1
                    frl[i+1][k] = 1
                }
            }
        }
    }
    for(let i=0;i<=props.funLen;i++){
        for(let j=0;j<funRangedList[i].length;j++){
            if(frl[i][j]===0){
                fun.push(funRangedList[i][j])
            }
        }
    }
    return fun
}
function merge(str1,str2){
    let xflag=false
    if(str1.endsWith('-')||str2.endsWith('-')){
        xflag=true
    }
    str1=str1.substring(0,str1.length-1)
    str2=str2.substring(0,str2.length-1)
    let str=''
    for(let i=0;i<str1.length;i++){
        if(str1[i]!==str2[i]){
            str+='*'
        }
        if(str1[i]===str2[i]){
            str+=str1[i]
        }
    }
    if(xflag){
        str+='-'
    }else{
        str+='+'
    }
    return str
}
function mergibleAll(props, funRangedList){
    for(let i=0;i<props.funLen;i++){
        for(let j=0;j<funRangedList[i].length;j++){
            for(let k=0;k<funRangedList[i+1].length;k++){
                if(mergible(
                    funRangedList[i][j],
                    funRangedList[i+1][k],
                )){
                    return true
                }
            }
        }
    }
    return false
}
function mergible(str1,str2){
    str1=str1.substring(0,str1.length-1)
    str2=str2.substring(0,str2.length-1)
    if(str1.length!==str2.length){
        return false
    }
    let c=0
    let s1c=0,s2c=0
    for(let i=0;i<str1.length;i++){
        if(str1[i]!=='*' && str2[i]!=='*') {
            if (str1[i] !== str2[i]) {
                c++
            }
            if (c > 1) {
                break
            }
        }
        if(str1[i]==='*' && str2[i]!=='*'){
            s1c++
        }
        if(str1[i]!=='*' && str2[i]==='*'){
            s2c++
        }
    }
    return c === 0 && (s1c === 0 || s2c === 0) || c <= 1 && (s1c === 0 && s2c === 0);
}
