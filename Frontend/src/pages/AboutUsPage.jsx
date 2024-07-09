import React from 'react';
import Header from '../components/Header.jsx';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Über uns</h1>
        <p className="mb-4">
          Willkommen bei PBR! Diese Anwendung ermöglicht es den Nutzern, nach Büchern zu suchen, Rezensionen zu lesen und zu schreiben und ihre Lieblingsrezensionen zu markieren.
          Unsere Plattform bietet eine spannende Möglichkeit, Bucherfahrungen zu entdecken und zu teilen.
        </p>
        <p>
          Als Absolventen der WBS Coding School haben wir diese Full-Stack-Webanwendung als Teil unseres Abschlussprojekts entwickelt.
          Unser Projekt basiert auf dem MERN-Stack (MongoDB, Express.js, React und Node.js).
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
