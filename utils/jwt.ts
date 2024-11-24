import {jwtDecode} from "jwt-decode";

export async function isTokenExpired(token:string) {
    try {
    const decoded:any = jwtDecode(token); 
    const currentTime = Math.floor(Date.now() / 1000); 
    return decoded?.exp < currentTime; 
    } catch (error:any) {
        // console.error("Error decoding token:", error);
    return true;
    }
}