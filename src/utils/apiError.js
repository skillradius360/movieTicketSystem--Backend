

class apiError extends Error{
    constructor(statusCode,
                message="some error occured",
                error = [],
                stack=""
    )
    {          
        super(message)
        this.statusCode=statusCode,
        this.message= message,
        this.error=error,
        this.data=null
        this.success=false

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }  
}

}

export {apiError}