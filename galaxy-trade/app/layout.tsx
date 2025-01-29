import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Head from 'next/head';
import { Provider } from '@/components/ui/provider';
import { getServerSession } from "next-auth";
import ClientSessionProvider from './components/ClientSessionProvider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  console.log({ session });
  const user = session?.user;
  let isLoggedIn = false;

  if (session) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GalaxyTrade</title>
      </Head>
      <body>
        <ClientSessionProvider session={session}>
          <Provider>
            <header>
              <Navbar username={user?.name || ""} isLoggedIn={isLoggedIn} />
            </header>
            <main>{children}</main>
            <Footer />
          </Provider>
        </ClientSessionProvider>
      </body>
    </html>
  );
};
