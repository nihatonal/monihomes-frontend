import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import Hero from './components/Hero';
import RoomsSection from './components/RoomsSection';
import OwnerBanner from './components/OwnerBanner';
import Reservation from './components/Reservation';
import FethiyeBanner from './components/FethiyeBanner';
import GuestReviews from './components/GuestReviews';
import VillaShowcase from './components/VillaShowcase';
import FAQ from './components/FAQ';
import Contact from './components/Contact';

import WhatsAppButton from '../shared/UI/WhatsAppButton'
import { useLocation } from 'react-router-dom';
function Home(props) {
    const location = useLocation();
    useEffect(() => {
        if (location.state?.scrollTo) {
            const targetId = location.state.scrollTo;
            const element = document.getElementById(targetId);

            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 200); // DOM hazır olsun diye küçük delay
            }
        }
    }, [location]);
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
            <VillaShowcase />
            <FAQ />
            <Contact />
            <WhatsAppButton />

        </div>
    );
}

export default Home;