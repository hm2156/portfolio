'use client';

import ContactContent from './ContactContent';

const ContactSection = ({ profile }) => (
  <section
    id="contact"
    className="relative h-[700px] bg-black"
    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
  >
    <div className="relative h-[calc(100vh+700px)] -top-[100vh]">
      <div className="h-[700px] sticky top-[calc(100vh-700px)] shadow-[0_-20px_80px_rgba(0,0,0,0.45)]">
        <ContactContent profile={profile} />
      </div>
    </div>
  </section>
);

export default ContactSection;
