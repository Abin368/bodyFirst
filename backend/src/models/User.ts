import mongoose, { Schema, Document } from "mongoose";

export type Role = 'owner' | 'trainer' | 'member'
export interface IUser extends Document {
    gymId: string,
    fullName: string
    phone: string,
    role: Role,
    isActive: boolean,
    imageUrl?: string,
    email: string,
    passwordHash: string,
    gender?: 'male' | 'female' | 'other',
    isVerified: boolean,
    isOnboarded: boolean,
    profileStep: number,

    dob?: Date,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema: Schema<IUser> = new Schema(
    {
        gymId: {
            type: String,
            required: function (this: IUser) {

                return this.role !== 'owner';
            }
        },

        fullName: { type: String, required: true, trim: true },

        phone: { type: String, trim: true },
        role: {
            type: String,
            enum: ['owner', 'trainer', 'member', 'admin'],
            default: 'member'
        },
        isActive: { type: Boolean, default: true },
        imageUrl: { type: String },
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        isVerified: { type: Boolean, default: false },
        isOnboarded: { type: Boolean, default: false },
        profileStep: { type: Number, default: 1 },
        dob: { type: Date }

    },
    { timestamps: true }
)

export default mongoose.model<IUser>('User', UserSchema)