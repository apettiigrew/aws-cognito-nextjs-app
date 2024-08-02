
import { NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'

const {
    NEXT_PUBLIC_OAUTH_DOMAIN,
    NEXT_PUBLIC_USER_POOL_CLIENT_ID
} = process.env

export async function GET(request: NextRequest) {
    let authorizeParams = new URLSearchParams()
    const origin = request.nextUrl.origin

    const state = crypto.randomBytes(16).toString('hex')

    authorizeParams.append('response_type', 'code')
    authorizeParams.append('client_id', NEXT_PUBLIC_USER_POOL_CLIENT_ID as string)
    authorizeParams.append('redirect_uri', `${origin}/api/auth/callback`)
    authorizeParams.append('state', state)
    authorizeParams.append('identity_provider', 'Google')
    authorizeParams.append('scope', 'phone email openid aws.cognito.signin.user.admin')

    // console.log("running routes");
    // return NextResponse.redirect(new URL('/signup', request.url))
    const baseUrl = `https://${NEXT_PUBLIC_OAUTH_DOMAIN}`;
    return NextResponse.redirect(new URL(`/oauth2/authorize?${authorizeParams.toString()}`, baseUrl))
}