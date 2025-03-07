import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import metsLogo from '~/assets/mets-logo.png';


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <div>
      <img src={metsLogo} alt="Mets Logo" width="500" height="600"/>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div>
      <h1>Error</h1>
    </div>
  );
}