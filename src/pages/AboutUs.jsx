import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageModal from '../components/ImageModal';

const AboutUs = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const operationsTeam = [
    {
      name: 'Henry Ly',
      role: 'Founder',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Karen Tang',
      role: 'Design & UX Tech Lead',
      image: 'https://placehold.co/150x150'
    }
  ];

  const advisors = [
    {
      name: 'Jessica Zahn',
      role: 'AI Team - Anthropic',
      subRole: 'Bio-Neural Computing & Training',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Jerome Pesenti-Francois',
      role: 'Meta AI',
      subRole: 'Team AI',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Paul Albertson',
      role: 'Google',
      subRole: 'Machine Learning',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Chris Symons',
      role: 'Chief AI Scientist',
      subRole: 'MITRE Corporation',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Mike Collins',
      role: 'Director of Deep Learning Programs',
      subRole: 'MITRE Corporation',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Nathan Leonardo da Silva',
      role: 'Senior Machine Learning',
      subRole: 'MITRE Corporation',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Sergio Escalera Viejo, PhD',
      role: 'Co-founder & AI & ML Prof',
      subRole: 'Google',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Nuno Vasconcelos',
      role: 'Professor & PhD',
      subRole: 'UCSD Computer',
      image: 'https://placehold.co/150x150'
    },
    {
      name: 'Karima Velazquez',
      role: 'VP AI & Computer',
      subRole: 'Education Institute',
      image: 'https://placehold.co/150x150'
    }
  ];

  const partners = [
    {
      name: 'Kiwix',
      logo: 'https://placehold.co/200x100'
    },
    {
      name: 'Learn Sphere AI',
      logo: 'https://placehold.co/200x100'
    }
  ];

  const galleryImages = [
    {
      src: 'https://picsum.photos/seed/workshop1/600/450',
      caption: 'AI Workshop at Local High School',
      alt: 'Students collaborating on AI project'
    },
    {
      src: 'https://picsum.photos/seed/workshop2/600/450',
      caption: 'Teacher Training Program',
      alt: 'Teacher training session'
    },
    {
      src: 'https://picsum.photos/seed/workshop3/600/450',
      caption: 'Student Project Presentations',
      alt: 'Students presenting their AI projects'
    },
    {
      src: 'https://picsum.photos/seed/workshop4/600/450',
      caption: 'Community Outreach Event',
      alt: 'Community outreach event'
    },
    {
      src: 'https://picsum.photos/seed/workshop5/600/450',
      caption: 'Hands-on Learning Session',
      alt: 'Hands-on AI learning session'
    },
    {
      src: 'https://picsum.photos/seed/workshop6/600/450',
      caption: 'Global Partnership Meeting',
      alt: 'Global partnership meeting'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        <section className="about-section">
          <h1>About Learn AI Anywhere</h1>
          <p>Learn AI Anywhere was founded with a clear mission: to provide all humans everywhere with the skills to understand emerging tech, and the opportunities to progress in the digital world.</p>
          <p>Our insights, hard work, working together as a global team, and scalable, full-stack platforms is how we make this vision a bit closer to our objective. Learning AI and other tech, and accelerating the world.</p>
          <p>If you are a tech professional, student, teacher, parent, or staff member, we deliver our education and learn about AI. At the same time, we are building a community of people who want to learn and grow together.</p>
          <p>With help from tech companies and volunteers, we can scale our solutions to scale up more students to accessible tech careers. Here is a list who is helping us make our mission possible.</p>
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
                <div className="gallery-caption">{image.caption}</div>
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

        <section className="team-section">
          <h2>Our Operations Team</h2>
          <div className="team-grid">
            {operationsTeam.map((member) => (
              <div key={member.name} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="advisors-section">
          <h2>Our Advisors</h2>
          <div className="advisors-grid">
            {advisors.map((advisor) => (
              <div key={advisor.name} className="advisor-card">
                <div className="advisor-image">
                  <img src={advisor.image} alt={advisor.name} />
                </div>
                <h3>{advisor.name}</h3>
                <p className="advisor-role">{advisor.role}</p>
                <p className="advisor-subrole">{advisor.subRole}</p>
              </div>
            ))}
          </div>
        </section>

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
          <p>Join us in our mission to bring AI literacy to underserved communities worldwide.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn-primary">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
