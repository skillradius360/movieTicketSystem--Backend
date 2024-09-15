class apiResponse{
    constructor(statusCode,data,message){
        this.statusCode=statusCode,
        this.message=message
        this.success= true,
        this.data=data

    }
}

export {apiResponse}