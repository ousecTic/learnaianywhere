import React from 'react';
import Button from '../components/shared/Button';
import ugandaClassroom from '../assets/images/about/uganda-classroom.jpg';
import studentTestimony from '../assets/images/about/student-testimony.jpg';
import worldMap from '../assets/images/about/world-map.svg';
import testimonyPoster from '../assets/images/about/teacher-testimony-poster.jpg';
import countries from '../data/learner-countries.json';
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
      alt: 'Learners collaborating on AI projects',
      caption: 'Learners in Colombia diving into the fundamentals of artificial intelligence during the \'Intro to AI\' course led by Laura'
    },
    {
      src: gallery2,
      alt: 'Learners using mobile devices for AI learning',
      caption: 'Learners in Uganda getting hands-on experience with an introductory Generative AI app, exploring the core concepts using Markov chains'
    },
    {
      src: gallery3,
      alt: 'Learners working together',
      caption: 'Learners in Uganda preparing to present the projects they developed using a local language model'
    },
    {
      src: gallery4,
      alt: 'Teacher presenting to learners',
      caption: 'Sammy teaching the crucial concepts of misinformation and disinformation in our introductory Generative AI curriculum'
    },
    {
      src: gallery5,
      alt: 'Learners with project materials',
      caption: 'Sammy introducing the core mechanics of generative image models to learners in our AI literacy program.'
    },
    {
      src: gallery6,
      alt: 'Classroom AI learning',
      caption: 'Educators and learners gathering local environmental data using the NeuroPocket app to build and train custom image classifiers offline'
    },
    {
      src: gallery7,
      alt: 'Learner engagement',
      caption: 'Joseph explaining the rules of the interactive \'Acting like a language model\' game to the class'
    },
    {
      src: gallery8,
      alt: 'Group discussion',
      caption: 'Learners verifying AI results by transcribing and double-checking text from a local language model'
    },
    {
      src: gallery9,
      alt: 'Interactive lesson',
      caption: 'Bernadete leading a train-the-trainer workshop on how to effectively deliver and implement our AI literacy courses'
    },
    {
      src: gallery10,
      alt: 'Learners with generative AI',
      caption: 'Bernadette teaching the importance of feature diversity for image classifiers during our introductory AI course'
    },
    {
      src: gallery11,
      alt: 'AI tools in classroom',
      caption: 'Learners cleaning and refining their image data to improve classifier performance.'
    },
    {
      src: gallery12,
      alt: 'Learner presentation',
      caption: 'Learners playing the \'describer-drawer\' game, where they must guide their partners to recreate an image using only verbal instructions'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        <section className="about-section">
          <h1>About Learn AI Anywhere</h1>
          <p>Most AI literacy courses assume three things: reliable internet, enough computers, and teachers trained to use them. That isn’t the case in a lot of places. <a href="https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx" target="_blank" rel="noopener noreferrer">2.2 billion people are still offline</a>. <a href="https://iite.unesco.org/wp-content/uploads/2023/07/Analytical-report-fnl5.pdf" target="_blank" rel="noopener noreferrer">Two-thirds of educators surveyed across 59 countries</a> say their school doesn’t have enough computers. And many teachers haven’t been trained to teach with technology. In sub-Saharan Africa, for example, <a href="https://www.unesco.org/en/articles/startling-digital-divides-distance-learning-emerge" target="_blank" rel="noopener noreferrer">only half of secondary teachers</a> have the minimum training, and it often leaves out ICT skills.</p>
          <p>We wanted to remove these barriers so anyone can become AI literate, no matter what environment they are in. We built the course to work without internet, on whatever devices are available, even a single phone. Whoever runs it is guided by short videos that explain every idea, so they don’t need any previous AI knowledge.</p>

          <img
            src={ugandaClassroom}
            alt="Classroom in Uganda with limited technology resources"
            className="about-photo"
          />
          <p className="image-caption">This picture was taken in Uganda by Michael from Future Upgrade. A group of students is using Michael’s phone and data to play with ChatGPT. This photo is what inspired us to develop an offline-first AI literacy course.</p>

          <p>Our goal is to show anyone, anywhere, that AI is a product of human choices. We all have a say in how it’s used, what it’s used for, and who it’s built for, starting with the things and the people we care about.</p>

          <p>Below is a note from one of our learners in Uganda. It’s what we hope every learner takes from our course.</p>

          <img
            src={studentTestimony}
            alt="Handwritten note from a learner about understanding AI"
            className="about-photo"
          />

          <p>Since then, learners in {countries.length} countries have used our course.</p>

          <img
            src={worldMap}
            alt={`World map with the ${countries.length} countries where we have learners highlighted`}
            className="about-photo"
          />

          <p>One of them is a school principal, who shared this after going through the course:</p>

          <div className="about-video-frame">
            <video
              className="about-video"
              src="/media/teacher-testimony.mp4"
              poster={testimonyPoster}
              controls
              playsInline
              preload="none"
            />

          </div>
          <p className="image-caption">Video edited by Leah Sugg and Gabrielle Augier.</p>

          <p>AI will be shaped by the people who understand it, and we want to make sure it’s shaped by anyone, anywhere.</p>
        </section>

        <section className="gallery-section">
          <h2>Photos from our courses</h2>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="gallery-item"
                role="button"
                tabIndex={0}
                aria-label={`Open picture: ${image.alt}`}
                onClick={() => setSelectedImage(image)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedImage(image);
                  }
                }}
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
