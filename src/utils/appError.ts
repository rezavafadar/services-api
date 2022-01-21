 class AppError extends Error{
    
    statusCode:number
    status:string
    errors:(string | number)[]

    constructor(message:string,statusCode:number,errors ?:(string | number)[]){
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.errors = errors ? errors : []
    }
}

export default AppError