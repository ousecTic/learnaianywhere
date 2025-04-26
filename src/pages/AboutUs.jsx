import React from 'react';
import Button from '../components/shared/Button';
import ugandaClassroom from '../assets/images/about/uganda-classroom.jpg';
import ImageModal from '../components/ImageModal';

// Import partnership logos
import kiwixLogo from '../assets/images/about/partnerships/kiwix-logo.png';
import futureUpgradeLogo from '../assets/images/about/partnerships/future-upgrade-logo.png';
import nyansapoLogo from '../assets/images/about/partnerships/nyansapo-logo.jpg';

// Import gallery images
import gallery1 from '../assets/images/about/gallery/1742493972267.jpg';
import gallery2 from '../assets/images/about/gallery/IMG_20241001_174000.jpg';
import gallery3 from '../assets/images/about/gallery/IMG_20241001_174039 (2).jpg';
import gallery4 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.38.51_cf3a6ec6.jpg';
import gallery5 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.43.20_cbca0192.jpg';
import gallery6 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.45.36_b15f29ba.jpg';
import gallery7 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.47.12_ad19e985.jpg';
import gallery8 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.48.35_2c57b657.jpg';
import gallery9 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.49.38_fa3b03b2.jpg';
import gallery10 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.52.07_781f0086.jpg';
import gallery11 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.53.12_6b184c63.jpg';
import gallery12 from '../assets/images/about/gallery/WhatsApp Image 2025-04-26 at 18.55.50_6baf4b6c.jpg';

const AboutUs = () => {
  const [selectedImage, setSelectedImage] = React.useState(null);


  const partners = [
    {
      name: 'Kiwix',
      logo: kiwixLogo
    },
    {
      name: 'Future Upgrade',
      logo: futureUpgradeLogo
    },
    {
      name: 'Nyansapo',
      logo: nyansapoLogo
    }
  ];

  const galleryImages = [
    {
      src: gallery1,
      alt: 'Students collaborating on AI projects'
    },
    {
      src: gallery2,
      alt: 'Students using mobile devices for AI learning'
    },
    {
      src: gallery3,
      alt: 'Students working together'
    },
    {
      src: gallery4,
      alt: 'Teacher presenting to students'
    },
    {
      src: gallery5,
      alt: 'Students with project materials'
    },
    {
      src: gallery6,
      alt: 'Classroom AI learning'
    },
    {
      src: gallery7,
      alt: 'Student engagement'
    },
    {
      src: gallery8,
      alt: 'Group discussion'
    },
    {
      src: gallery9,
      alt: 'Interactive lesson'
    },
    {
      src: gallery10,
      alt: 'Students with generative AI'
    },
    {
      src: gallery11,
      alt: 'AI tools in classroom'
    },
    {
      src: gallery12,
      alt: 'Student presentation'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        <section className="about-section">
          <h1>About Learn AI Anywhere</h1>
          <p>This project started because we saw a gap in existing AI literacy curriculums. Most resources are designed mainly for developed countries and often assume you have constant access to computers, internet, and electricity. But that's not the reality for many communities around the world.</p>
          
          <div className="inspiration-photo-container">
            <img 
              src={ugandaClassroom} 
              alt="Classroom in Uganda with limited technology resources" 
              className="inspiration-photo"
            />
            <p className="photo-caption">This photo inspired our project. It shows the real world situation: many places face challenges with technology access, limited electricity, unreliable internet, and not enough computers. These communities often get overlooked by traditional educational resources.</p>
          </div>
          
          <p>Our mission is to fill this gap by making high quality AI literacy education accessible to everyone, anywhere. Even if you only have a smartphone and limited internet, you can still learn AI anywhere.</p>
        </section>

        <section className="gallery-section">
          <h2>Our Impact in Action</h2>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="gallery-item"
                onClick={() => setSelectedImage(image)}
              >
                <img src={image.src} alt={image.alt} />

              </div>
            ))}
          </div>
        </section>

        {selectedImage && (
          <ImageModal
            image={selectedImage.src}
            caption={selectedImage.caption}
            onClose={() => setSelectedImage(null)}
          />
        )}


        <section className="partners-section">
          <h2>Our Partners</h2>
          <div className="partners-grid">
            {partners.map((partner) => (
              <div key={partner.name} className="partner-card">
                <img src={partner.logo} alt={partner.name} />
              </div>
            ))}
          </div>
        </section>

        <div className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>Join us in bringing AI literacy education Anywhere, even in areas with limited technology access.</p>
          <div className="cta-buttons">
            <Button to="/contact" variant="primary">Contact Us</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
