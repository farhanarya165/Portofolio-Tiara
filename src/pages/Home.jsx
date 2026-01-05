import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import FeaturedProjects from '../components/FeaturedProjects';
import SolvingProblems from '../components/SolvingProblems';
import Portfolio from '../components/Portfolio';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Hero />
      <Stats />
      <FeaturedProjects />
      <SolvingProblems />
      <Portfolio />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;