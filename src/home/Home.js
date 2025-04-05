import React from 'react';
import { Helmet } from "react-helmet";
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
    <Helmet>
        <title>Monihomes | Fethiye’de Konforlu Tatil</title>
        <meta name="description" content="Fethiye'nin merkezinde konforlu bir konaklama deneyimi sunan Monihomes. Şimdi rezervasyon yapın!" />
        <meta property="og:title" content="Monihomes | Fethiye’de Tatil" />
        <meta property="og:description" content="Fethiye merkezde konforlu daireler. Şimdi rezervasyon yapın!" />
        <meta property="og:image" content="https://67f136c33dca11a7148e77c3--monihomes.netlify.app/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

    </Helmet>
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