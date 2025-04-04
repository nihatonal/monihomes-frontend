import React from 'react';

import Hero from './components/Hero';
import RoomsSection from './components/RoomsSection';
import OwnerBanner from './components/OwnerBanner';
import Reservation from './components/Reservation';
import FethiyeBanner from './components/FethiyeBanner';
import GuestReviews from './components/GuestReviews';
import FAQ from './components/FAQ';
import Contact from './components/Contact';

import WhatsAppButton from '../shared/UI/WhatsAppButton'
function Home(props) {

    return (
        <div >
            <Hero />
            <OwnerBanner />
            <RoomsSection />
            <GuestReviews />
            <FethiyeBanner />
            <Reservation />
            <FAQ />
            <Contact />
            <WhatsAppButton />

        </div>
    );
}

export default Home;