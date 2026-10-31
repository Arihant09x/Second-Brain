declare namespace JSX {
  interface IntrinsicElements {
    "spline-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}

declare module "oauthify" {
  // Minimal type surface to satisfy TS when dynamically importing
  export function createOAuthProvider(options: {
    provider: "google" | "github";
    clientId: string;
    redirectUri: string;
    scope?: string;
  }): {
    signIn?: () => Promise<unknown>;
    login?: () => Promise<unknown>;
  };
}
