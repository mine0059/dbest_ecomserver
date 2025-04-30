const { Schema, model } = require("mongoose");

const tokenScheme = Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    refreshToken: {type: String, required: true},
    accessToken: String,
    createdAt: {type: Date, default: Date.now, expires: 60 * 86400},
});

exports.Token = model("Token", tokenScheme,);