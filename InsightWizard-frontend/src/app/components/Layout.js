// components/Layout.js
import React from 'react';
import Head from 'next/head';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Insight Wizard</title>
        <meta name="description" content="Your AI Chat Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Layout;
