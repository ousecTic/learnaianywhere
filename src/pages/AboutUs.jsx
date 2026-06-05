import React from 'react';
import Button from '../components/shared/Button';
import ugandaClassroom from '../assets/images/about/uganda-classroom.jpg';
import studentTestimony from '../assets/images/about/student-testimony.jpg';
import ImageModal from '../components/ImageModal';

// Import partnership logos
import kiwixLogo from '../assets/images/about/partnerships/kiwix-logo.png';
import futureUpgradeLogo from '../assets/images/about/partnerships/future-upgrade-logo.png';
import learningEqualityLogo from '../assets/images/about/partnerships/learning-equality.png';
import learningPassportLogo from '../assets/images/about/partnerships/learning-passport.jpg';
import aiLiteracyDayLogo from '../assets/images/about/partnerships/ai-literacy-day-logo.png';
import oliLogo from '../assets/images/about/partnerships/oli-logo.png';

// Import gallery images
import gallery1 from '../assets/images/about/gallery/picture-1.jpg';
import gallery2 from '../assets/images/about/gallery/picture-2.jpg';
import gallery3 from '../assets/images/about/gallery/picture-3.jpg';
import gallery4 from '../assets/images/about/gallery/picture-4.jpg';
import gallery5 from '../assets/images/about/gallery/picture-5.jpg';
import gallery6 from '../assets/images/about/gallery/picture-6.jpg';
import gallery7 from '../assets/images/about/gallery/picture-7.jpg';
import gallery8 from '../assets/images/about/gallery/picture-8.jpg';
import gallery9 from '../assets/images/about/gallery/picture-9.jpeg';
import gallery10 from '../assets/images/about/gallery/picture-10.jpg';
import gallery11 from '../assets/images/about/gallery/picture-11.jpg';
import gallery12 from '../assets/images/about/gallery/picture-12.jpg';

const AboutUs = () => {
  const [selectedImage, setSelectedImage] = React.useState(null);


  const partners = [
    {
      name: 'Kiwix',
      logo: kiwixLogo,
      url: 'https://kiwix.org/'
    },
    {
      name: 'Future Upgrade',
      logo: futureUpgradeLogo,
      url: 'https://futureupgrades.org/'
    },
    {
      name: 'Learning Equality',
      logo: learningEqualityLogo,
      url: 'https://learningequality.org/'
    },
    {
      name: 'Learning Passport',
      logo: learningPassportLogo,
      url: 'https://www.learningpassport.org/'
    },
    {
      name: 'AI Literacy Day',
      logo: aiLiteracyDayLogo,
      url: 'https://ailiteracyday.org/'
    },
    {
      name: 'OLI',
      logo: oliLogo,
      url: 'https://www.offlineinternet.org/'
    }
  ];

  const galleryImages = [
    {
      src: gallery1,
      alt: 'Students collaborating on AI projects',
      caption: 'Students in Colombia diving into the fundamentals of artificial intelligence during the \'Intro to AI\' course led by Laura'
    },
    {
      src: gallery2,
      alt: 'Students using mobile devices for AI learning',
      caption: 'Students in Uganda getting hands-on experience with an introductory Generative AI app, exploring the core concepts using Markov chains'
    },
    {
      src: gallery3,
      alt: 'Students working together',
      caption: 'Students in Uganda preparing to present the projects they developed using a local language model'
    },
    {
      src: gallery4,
      alt: 'Teacher presenting to students',
      caption: 'Sammy teaching the crucial concepts of misinformation and disinformation in our introductory Generative AI curriculum'
    },
    {
      src: gallery5,
      alt: 'Students with project materials',
      caption: 'Sammy introducing the core mechanics of generative image models to students in our AI literacy program.'
    },
    {
      src: gallery6,
      alt: 'Classroom AI learning',
      caption: 'Educators and students gathering local environmental data using the NeuroPocket app to build and train custom image classifiers offline'
    },
    {
      src: gallery7,
      alt: 'Student engagement',
      caption: 'Joseph explaining the rules of the interactive \'Acting like a language model\' game to the class'
    },
    {
      src: gallery8,
      alt: 'Group discussion',
      caption: 'Students verifying AI results by transcribing and double-checking text from a local language model'
    },
    {
      src: gallery9,
      alt: 'Interactive lesson',
      caption: 'Bernadete leading a train-the-trainer workshop on how to effectively deliver and implement our AI literacy lessons'
    },
    {
      src: gallery10,
      alt: 'Students with generative AI',
      caption: 'Bernadette teaching the importance of feature diversity for image classifiers during our introductory AI course'
    },
    {
      src: gallery11,
      alt: 'AI tools in classroom',
      caption: 'Students cleaning and refining their image data to improve classifier performance.'
    },
    {
      src: gallery12,
      alt: 'Student presentation',
      caption: 'Students playing the \'describer-drawer\' game, where they must guide their partners to recreate an image using only verbal instructions'
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
              <a 
                key={partner.name} 
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card"
              >
                <img src={partner.logo} alt={partner.name} />
              </a>
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
