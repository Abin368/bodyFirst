import { Request,Response,NextFunction } from "express";
import { AppError } from "../errors/app.error";

import { MESSAGES } from '../enums/message.constant'
import logger from "../utils/logger";
import { HttpStatus } from "../enums/http.status";

export const restricedFileUpload = (req:Request,res:Response,next:NextFunction)=>{
    const file=req.file
    if(!file){
        logger.warn('No file provided in request')
        throw new AppError(HttpStatus.BAD_REQUEST,MESSAGES.OWNER.NO_FILE)
    }

    const allowedMineTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxFileSize =5 * 1024 * 1024 
    
    if(!allowedMineTypes.includes(file.mimetype)){
        logger.warn(`Invalid file type: ${file.mimetype}`)
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OWNER.INVALID_FILE_UPLOAD)   
    }

    if (file.size > maxFileSize) {
        logger.warn(`File size too large: ${file.size}`)
        throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OWNER.FILE_TOO_LARGE)
      }
    
      logger.info(`File validation passed for file: ${file.originalname}`)
      next()
}