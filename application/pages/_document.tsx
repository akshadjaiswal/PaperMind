import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="grain-overlay">
      <Head>
        <meta name="description" content="Turn any research topic into a structured academic synthesis using real peer-reviewed papers." />
        <meta property="og:title" content="PaperMind" />
        <meta property="og:description" content="AI-powered research synthesis from peer-reviewed papers." />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
