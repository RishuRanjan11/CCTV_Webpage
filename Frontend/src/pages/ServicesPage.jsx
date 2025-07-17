import React from 'react';
import './ServicesPage.css';
import Footer from '../components/Footer';

const ServicesPage = () => {
    const services = [
        {
            id: 1,
            title: 'CCTV Installation',
            description: 'Professional installation for homes, offices, and large facilities.',
            icon: 'https://img.icons8.com/3d-fluency/94/maintenance.png'
        },
        {
            id: 2,
            title: '24/7 Monitoring',
            description: 'Real-time surveillance and emergency response.',
            icon: 'https://img.icons8.com/keek/100/monitor.png'
        },
        {
            id: 3,
            title: 'Maintenance & Support',
            description: 'Regular servicing and technical support for all systems.',
            icon: 'https://img.icons8.com/color/96/online-support.png'
        },
        {
            id: 4,
            title: 'Custom Solutions',
            description: 'Tailored security setups for special requirements.',
            icon: 'https://img.icons8.com/color/96/security-guard.png'
        }
    ];

    return (
        <div className="services-page">
            <header className="services-header">
                <h1>Our Services</h1>
                <p>
                    At CCTV Digital Surveillance, we deliver complete, reliable, and affordable security solutions
                    tailored to your needs. From expert installation to 24/7 monitoring, we’re your one-stop
                    destination for peace of mind.
                </p>
            </header>



            {/* Cards Grid */}
            <section className="services-grid">
                {services.map(service => (
                    <div className="service-card" key={service.id}>
                        <img src={service.icon} alt={service.title} />
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </section>
            <section className="services-overview">
                <h2>What We Offer</h2>
                <p>
                    Our solutions go beyond hardware. From consultation to long-term support, we provide end-to-end
                    surveillance services designed to meet your specific needs.
                </p>
                {/* Insert the updated <ul> here */}


                <ul>
                    <li>
                        <strong>Professional Installation:</strong> Expert setup by trained technicians ensuring maximum coverage and optimal performance.
                    </li>
                    <li>
                        <strong>24/7 Live Monitoring:</strong> Constant real-time surveillance for instant threat detection and faster emergency response.
                    </li>
                    <li>
                        <strong>Tailored Security Plans:</strong> Custom setups based on property size, layout, and unique security requirements.
                    </li>
                    <li>
                        <strong>Ongoing Maintenance:</strong> Regular system checks and fast support to keep your surveillance running without fail.
                    </li>
                </ul>

            </section>

            {/* Call To Action */}
            <section className="services-cta">
                <h3>Secure Your Space Today</h3>
                <p>
                    Ready to enhance your security? Contact us for a free consultation and let our experts
                    help you find the perfect surveillance solution.
                </p>
                <a href="/contact" className="btn-contact">Contact Us</a>
            </section>

            
        </div>
    );
};

export default ServicesPage;
