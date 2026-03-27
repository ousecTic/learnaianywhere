import React from 'react';
import Button from '../components/shared/Button';
import ugandaClassroom from '../assets/images/about/uganda-classroom.jpg';
import studentTestimony from '../assets/images/about/student-testimony.jpg';
import ImageModal from '../components/ImageModal';

// Import partnership logos
import kiwixLogo from '../assets/images/about/partnerships/kiwix-logo.png';
import futureUpgradeLogo from '../assets/images/about/partnerships/future-upgrade-logo.png';
import learningEqualityLogo from '../assets/images/about/partnerships/learning-equality.png';
import learningPassportLogo from '../assets/images/about/partnerships/learning-passport.jpeg';
import aiLiteracyDayLogo from '../assets/images/about/partnerships/ai-literacy-day-logo.png';

// Import gallery images
import gallery1 from '../assets/images/about/gallery/picture-1.jpg';
import gallery2 from '../assets/images/about/gallery/picture-2.jpg';
import gallery3 from '../assets/images/about/gallery/picture-3.jpg';
import gallery4 from '../assets/images/about/gallery/picture-4.jpg';
import gallery5 from '../assets/images/about/gallery/picture-5.jpg';
import gallery6 from '../assets/images/about/gallery/picture-6.jpg';
import gallery7 from '../assets/images/about/gallery/picture-7.jpg';
import gallery8 from '../assets/images/about/gallery/picture-8.jpg';
import gallery9 from '../assets/images/about/gallery/picture-9.jpg';
import gallery10 from '../assets/images/about/gallery/picture-10.jpg';
import gallery11 from '../assets/images/about/gallery/picture-11.jpg';
import gallery12 from '../assets/images/about/gallery/picture-12.jpg';

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
      name: 'Learning Equality',
      logo: learningEqualityLogo
    },
    {
      name: 'Learning Passport',
      logo: learningPassportLogo
    },
    {
      name: 'AI Literacy Day',
      logo: aiLiteracyDayLogo
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
          <p>We saw a gap in existing AI literacy resources. Most AI literacy lessons assume you have constant access to computers, internet, and electricity, but that is not the reality for many communities in the world.</p>
          
          <img 
            src={ugandaClassroom} 
            alt="Classroom in Uganda with limited technology resources" 
            className="about-photo"
          />
          <p className="image-caption">This picture was taken in Uganda where a single student is using a teacher's phone to play with ChatGPT. This photo is what inspired us to start developing an offline-first AI literacy curriculum.</p>

          <p>We wanted to remove these barriers so anyone can develop AI literacy skills no matter what environment they are in. Even if you only have a smartphone and limited internet you can still learn AI anywhere.</p>

          <p>This message from one of our first students in Uganda captures exactly what we hope every learner experiences. Today, we have learners in over 60 countries across the world:</p>

          <img 
            src={studentTestimony} 
            alt="Handwritten student feedback about understanding AI" 
            className="about-photo"
          />
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
          <h2>In Collaboration</h2>
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
