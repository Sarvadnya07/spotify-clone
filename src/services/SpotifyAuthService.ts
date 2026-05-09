
/**
 * SpotifyAuthService
 * Implements the high-security OAuth 2.0 PKCE (Proof Key for Code Exchange) flow.
 * No Client Secret is needed, making it perfect for single-page applications.
 */

const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // Placeholder for production config
const REDIRECT_URI = window.location.origin;

class SpotifyAuthService {
  /**
   * Generates a secure random string for the code verifier.
   */
  private generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Hashes the code verifier using SHA-256 to create the code challenge.
   */
  private async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Redirects the user to the Spotify Authorization page.
   */
  async redirectToAuthCodeFlow() {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem('spotify_verifier', verifier);

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('response_type', 'code');
    params.append('redirect_uri', REDIRECT_URI);
    params.append('scope', 'user-read-private user-read-email user-top-read');
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Exchanges the auth code for an access token.
   */
  async getAccessToken(code: string): Promise<string> {
    const verifier = localStorage.getItem('spotify_verifier');

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('code_verifier', verifier!);

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const { access_token } = await result.json();
    return access_token;
  }
}

export const spotifyAuthService = new SpotifyAuthService();
