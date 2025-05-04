// pages/_app.js
import '../src/index.css';  // ajusta la ruta si tu CSS global está en otro sitio

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
