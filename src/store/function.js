class FunctionStore {
  get() {
    const str = localStorage.getItem('function')
    const obj = JSON.parse(str)
    return obj
  }

  set(func) {
    const str = JSON.stringify(func)
    localStorage.setItem('function', str)
  }
}

export const FUNCTION_STORE = new FunctionStore