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
        {/* Prevent flash of wrong theme on reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pm-theme');var d=document.documentElement;if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
