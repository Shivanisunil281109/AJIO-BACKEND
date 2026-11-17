
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true,
        unique: true
    },

    gender: {
        type: String,
        required: true
    },

    dob: {
    type: String,
    default: ""
},

    inviteCode: {
        type: String
    },

    role: {
        type: String,
        default: "user",
        enum: ["user", "seller", "admin"]
    },


    isApprovedByAdmin: {
        type: Boolean,
        default: false
    }


});

const UserSchema = model("users", userSchema);

export default UserSchema;
