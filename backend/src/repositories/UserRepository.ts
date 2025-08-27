import { IUserRepository } from "../interfaces/IUserRepository";
import User,{IUser} from "../models/User";

export default class UserRepository implements IUserRepository {

   async create(userData: Partial<IUser>): Promise<IUser> {
       try{
        const user =new User(userData);
        return await user.save()
       }catch(error){
         throw new Error(`Error creating user: ${error}`);
       }
    }

    async findByEmail(email: String): Promise<IUser | null> {
        try{
            return await User.findOne({email})

        }catch(error){
              throw new Error(`Error finding user by email: ${error}`);
        }
    }

    async findById(id: String): Promise<IUser | null> {
        try{
            return await User.findById({id})
        }catch(error){
             throw new Error(`Error finding user by ID: ${error}`);
        }
    }

}