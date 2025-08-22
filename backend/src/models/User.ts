import mongoose, { Schema,Document } from "mongoose";

export interface IUser extends Document{
    gymId :string,
    firstName:string,
    lastName:string,
    phone:string,
    role: 'owner' | 'trainer' | 'member'| 'admin',
    isActive :boolean,
    imageUrl?:string,
    email:string,
    passwordHash:string,
    gender?:'male'|'female'|'other',
    address?:{
        city:string,
        pincode:string,
        state:string,
        street:string;
    };
    dob?:Date,
    createdAt:Date,
    updatedAt:Date
}

const UserSchema:Schema<IUser> =new Schema(
    {
        gymId:{type:String,required:true},
        firstName:{type:String,required:true,trim:true},
        lastName:{type:String ,required:true,trim:true},
        phone:{type:String ,required:true,trim:true},
        role:{
            type:String,
            enum:['owner','trainer','member','admin'],
            default:'member'
        },
        isActive:{type:Boolean,default:true},
        imageUrl:{type:String},
        email:{type:String,required:true,unique:true,lowercase:true},
        passwordHash:{type:String,required:true},
        gender:{type:String,enum:['male','female','other']},
        address:{
            city:{type:String},
            pincode:{type:String},
            state:{type:String},
            street:{type:String}
        },
        dob:{type:Date}

    },
    {timestamps:true}
)

export default mongoose.model<IUser>('User',UserSchema)