class DietError extends Error{
    constructor(message: string){
        super(message)
        this.name = 'DietError'
        Error.captureStackTrace(this, this.constructor)
    }
}

export default DietError