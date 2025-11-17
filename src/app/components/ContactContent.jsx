const ContactContent = ({ profile }) => (
  <div className="bg-black text-white py-16 px-3 sm:px-15 lg:px-6 xl:px-30 h-full w-full flex flex-col justify-between">
    <div className="flex flex-col sm:flex-row justify-between gap-10">
      <div>
        <p className="uppercase text-sm tracking-[0.4em] text-white/60 mb-3">Contact</p>
        <p className="text-xl sm:text-2xl font-medium">Let&apos;s build something new</p>
        <p className="text-white/70 mt-2 max-w-sm">
          Available for collaborations that pair full-stack systems with intentional art direction.
        </p>
      </div>
      <div className="text-left sm:text-right space-y-2">
        <p className="text-white/60 uppercase text-xs tracking-[0.3em]">Email</p>
        <a href={`mailto:${profile.email}`} className="text-lg sm:text-xl hover:underline">
          {profile.email}
        </a>
        <div className="flex sm:justify-end gap-4 text-sm uppercase tracking-[0.3em] text-white/60 pt-2">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Github
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Linkedin
          </a>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-16 gap-6">
      <h1 className="text-[18vw] sm:text-[14vw] leading-[0.8] font-bold tracking-tight hero-heading">
        Contact
      </h1>
      <p className="text-sm text-white/50">© {new Date().getFullYear()} {profile.name}</p>
    </div>
  </div>
);

export default ContactContent;
