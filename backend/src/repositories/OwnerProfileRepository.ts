import ownerProfile,{IOwnerProfile} from "../models/ownerProfile";

export default class OwnerProfileRepository {
    async create(data:Partial<IOwnerProfile>):Promise<IOwnerProfile>{
        const profile = new ownerProfile(data)
        return await profile.save()
    }
}