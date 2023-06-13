import {URLSearchParams} from "url";
import {Request} from "express";
import axios from "axios";
import type {afterOAuth, GoogleUser} from "../types/user";
import * as dotenv from 'dotenv';

dotenv.config();

const googleClientId = process.env.GOOGLECLIENTID;
const googleSecretId = process.env.GOOGLESECRETID;
const googleRootRedirectUrl = process.env.GOOGLEROOTURL


export function getGoogleAuthUrl(path: afterOAuth) {

    const options = {
        redirect_uri: `http://localhost:8080/${path}`,
        client_id: googleClientId || "",
        accessType: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ].join(" "),
    }


    const qs = new URLSearchParams(options);


    return `${googleRootRedirectUrl}?${qs.toString()}`;
}

export async function getGoogleData(req: Request, path: afterOAuth): Promise<GoogleUser> {
    const {code} = req.query;

    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: googleClientId,
        client_secret: googleSecretId,
        redirect_uri: `http://localhost:8080/${path}`,
        grant_type: "authorization_code",
    })

    const {access_token} = tokenResponse.data;

    const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })

    const {email, given_name, family_name} = userInfoResponse.data;

    return {given_name, family_name, email};

}