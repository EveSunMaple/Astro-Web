declare module "gravatar" {
  interface GravatarOptions {
    s?: string; // size
    r?: string; // rating
    d?: string; // default
    protocol?: string;
    host?: string;
  }
  
  interface Gravatar {
    url: (email: string, options?: GravatarOptions) => string;
    profile_url: (email: string, options?: GravatarOptions) => string;
  }
  
  const gravatar: Gravatar;
  export default gravatar;
} 