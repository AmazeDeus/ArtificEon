import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="Let's Build Something Amazing with GPT-4! The possibilities are beyond your imagination!"
          />
        </Head>
        <body>
          <Main />
          {/* portal for overlays */}
          <div id="overlays" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
