import "../src/index.css";
import Layout from "../src/components/Layout.jsx";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
