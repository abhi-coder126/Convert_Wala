const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const hasText = (value) => {
  return String(value || "").trim().length > 0;
};

const hasItems = (items, keys = []) => {
  return safeArray(items).some((item) =>
    keys.some((key) => hasText(item?.[key]))
  );
};

const getFilledItems = (items, keys = []) => {
  return safeArray(items).filter((item) =>
    keys.some((key) => hasText(item?.[key]))
  );
};

const getInitials = (name = "") => {
  const words = name.trim().split(" ").filter(Boolean);

  if (!words.length) return "YN";

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const lineArray = (value = "") => {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const ProgressBar = ({ label, level = 70, accent }) => {
  const safeLevel = Math.min(Number(level) || 0, 100);

  if (!hasText(label)) return null;

  return (
    <div className="premium-progress">
      <div className="premium-progress-top">
        <span>{label}</span>
        <small>{safeLevel}%</small>
      </div>
      <div className="premium-progress-track">
        <span style={{ width: `${safeLevel}%`, background: accent }}></span>
      </div>
    </div>
  );
};

const PremiumSection = ({ title, children, accent }) => {
  if (!children) return null;

  return (
    <section className="premium-section">
      <h3 style={{ "--accent": accent }}>{title}</h3>
      {children}
    </section>
  );
};

export default function ResumePreview({
  resumeData,
  template,
  activeSections = {},
}) {
  const personal = resumeData.personal || {};
  const accent = template?.accent || "#2563eb";
  const premiumStyle = template?.premiumStyle || "premium-blue-sidebar";
  const isPremium = template?.category === "premium" || template?.layout === "premium";

  const isSectionActive = (section) => activeSections?.[section] !== false;

  const personalActive = isSectionActive("personal");
  const showPersonalHeader =
    personalActive &&
    [
      personal.fullName,
      personal.jobTitle,
      personal.email,
      personal.phone,
      personal.location,
      personal.linkedin,
      personal.portfolio,
      personal.summary,
      personal.photo,
    ].some(hasText);

  const showContact =
    personalActive &&
    [
      personal.phone,
      personal.email,
      personal.location,
      personal.linkedin,
      personal.portfolio,
    ].some(hasText);

  const visibleSkills = isSectionActive("skills")
    ? getFilledItems(resumeData.skills, ["name"])
    : [];

  const visibleLanguages = isSectionActive("languages")
    ? getFilledItems(resumeData.languages, ["name"])
    : [];

  const visibleHobbies = isSectionActive("hobbies")
    ? getFilledItems(resumeData.hobbies, ["name"])
    : [];

  const visibleExperience = isSectionActive("experience")
    ? getFilledItems(resumeData.experience, [
        "title",
        "company",
        "location",
        "startDate",
        "endDate",
        "bullets",
      ])
    : [];

  const visibleEducation = isSectionActive("education")
    ? getFilledItems(resumeData.education, [
        "degree",
        "institute",
        "location",
        "startDate",
        "endDate",
        "details",
      ])
    : [];

  const visibleProjects = isSectionActive("projects")
    ? getFilledItems(resumeData.projects, ["name", "tech", "bullets"])
    : [];

  const visibleCertifications = isSectionActive("certifications")
    ? getFilledItems(resumeData.certifications, ["name", "issuer", "year"])
    : [];

  const visibleAwards = isSectionActive("awards")
    ? getFilledItems(resumeData.awards, ["name", "organization", "year"])
    : [];

  const visibleReferences = isSectionActive("references")
    ? getFilledItems(resumeData.references, [
        "name",
        "position",
        "phone",
        "email",
      ])
    : [];

  const visibleSocials = isSectionActive("socials")
    ? getFilledItems(resumeData.socials, ["platform", "url"])
    : [];

  const visibleCustomSections = isSectionActive("customSections")
    ? getFilledItems(resumeData.customSections, ["title", "content"])
    : [];

  if (isPremium) {
    return (
      <div className={`premium-resume ${premiumStyle}`} style={{ "--accent": accent }}>
        <aside className="premium-sidebar">
          {personalActive && personal.photo && (
            <div className="premium-photo-wrap">
              <img src={personal.photo} alt="Profile" />
            </div>
          )}

          {showPersonalHeader && (
            <div className="premium-side-name">
              <h2>{personal.fullName || getInitials(personal.fullName)}</h2>
              {hasText(personal.jobTitle) && <p>{personal.jobTitle}</p>}
            </div>
          )}

          {showContact && (
            <PremiumSection title="Contact" accent={accent}>
              <ul className="premium-contact-list">
                {personal.phone && <li>{personal.phone}</li>}
                {personal.email && <li>{personal.email}</li>}
                {personal.location && <li>{personal.location}</li>}
                {personal.linkedin && <li>{personal.linkedin}</li>}
                {personal.portfolio && <li>{personal.portfolio}</li>}
              </ul>
            </PremiumSection>
          )}

          {visibleSkills.length > 0 && (
            <PremiumSection title="Skills" accent={accent}>
              {visibleSkills.map((skill, index) => (
                <ProgressBar
                  key={index}
                  label={skill.name}
                  level={skill.level}
                  accent={accent}
                />
              ))}
            </PremiumSection>
          )}

          {visibleLanguages.length > 0 && (
            <PremiumSection title="Languages" accent={accent}>
              {visibleLanguages.map((lang, index) => (
                <ProgressBar
                  key={index}
                  label={lang.name}
                  level={lang.level}
                  accent={accent}
                />
              ))}
            </PremiumSection>
          )}

          {visibleHobbies.length > 0 && (
            <PremiumSection title="Hobbies" accent={accent}>
              <div className="premium-tags">
                {visibleHobbies.map((hobby, index) => (
                  <span key={index}>{hobby.name}</span>
                ))}
              </div>
            </PremiumSection>
          )}

          {visibleCustomSections.length > 0 &&
            visibleCustomSections.map((section, index) => (
              <PremiumSection
                title={section.title || "Custom Section"}
                accent={accent}
                key={index}
              >
                {hasText(section.content) && (
                  <p className="premium-side-text">{section.content}</p>
                )}
              </PremiumSection>
            ))}
        </aside>

        <main className="premium-main">
          {showPersonalHeader && (
            <header className="premium-top-header">
              <div>
                <h1>{personal.fullName || "Your Name"}</h1>
                {hasText(personal.jobTitle) && <p>{personal.jobTitle}</p>}
              </div>
            </header>
          )}

          {personalActive && hasText(personal.summary) && (
            <PremiumSection title="Profile Summary" accent={accent}>
              <p className="premium-text">{personal.summary}</p>
            </PremiumSection>
          )}

          {visibleExperience.length > 0 && (
            <PremiumSection title="Work Experience" accent={accent}>
              <div className="premium-timeline">
                {visibleExperience.map((exp, index) => (
                  <div className="premium-timeline-item" key={index}>
                    <div className="premium-date">
                      {[exp.startDate, exp.currentWorking ? "Present" : exp.endDate]
                        .filter(Boolean)
                        .join(" - ")}
                    </div>

                    <div className="premium-info">
                      {hasText(exp.title) && <h4>{exp.title}</h4>}
                      {(hasText(exp.company) || hasText(exp.location)) && (
                        <p className="premium-muted">
                          {[exp.company, exp.location].filter(Boolean).join(", ")}
                        </p>
                      )}

                      {lineArray(exp.bullets).length > 0 && (
                        <ul>
                          {lineArray(exp.bullets).map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PremiumSection>
          )}

          {visibleEducation.length > 0 && (
            <PremiumSection title="Education" accent={accent}>
              <div className="premium-timeline">
                {visibleEducation.map((edu, index) => (
                  <div className="premium-timeline-item" key={index}>
                    <div className="premium-date">
                      {[edu.startDate, edu.currentStudying ? "Present" : edu.endDate]
                        .filter(Boolean)
                        .join(" - ")}
                    </div>

                    <div className="premium-info">
                      {hasText(edu.degree) && <h4>{edu.degree}</h4>}
                      {(hasText(edu.institute) || hasText(edu.location)) && (
                        <p className="premium-muted">
                          {[edu.institute, edu.location].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {hasText(edu.details) && (
                        <p className="premium-text">{edu.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PremiumSection>
          )}

          {visibleProjects.length > 0 && (
            <PremiumSection title="Projects" accent={accent}>
              {visibleProjects.map((project, index) => (
                <div className="premium-block" key={index}>
                  {hasText(project.name) && <h4>{project.name}</h4>}
                  {hasText(project.tech) && (
                    <p className="premium-muted">{project.tech}</p>
                  )}
                  {lineArray(project.bullets).length > 0 && (
                    <ul>
                      {lineArray(project.bullets).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </PremiumSection>
          )}

          {visibleCertifications.length > 0 && (
            <PremiumSection title="Certifications" accent={accent}>
              {visibleCertifications.map((item, index) => (
                <div className="premium-block" key={index}>
                  {hasText(item.name) && <h4>{item.name}</h4>}
                  {(hasText(item.issuer) || hasText(item.year)) && (
                    <p className="premium-muted">
                      {[item.issuer, item.year].filter(Boolean).join(" | ")}
                    </p>
                  )}
                </div>
              ))}
            </PremiumSection>
          )}

          {visibleAwards.length > 0 && (
            <PremiumSection title="Awards" accent={accent}>
              {visibleAwards.map((item, index) => (
                <div className="premium-block" key={index}>
                  {hasText(item.name) && <h4>{item.name}</h4>}
                  {(hasText(item.organization) || hasText(item.year)) && (
                    <p className="premium-muted">
                      {[item.organization, item.year].filter(Boolean).join(" | ")}
                    </p>
                  )}
                </div>
              ))}
            </PremiumSection>
          )}

          {visibleReferences.length > 0 && (
            <PremiumSection title="References" accent={accent}>
              <div className="premium-reference-grid">
                {visibleReferences.map((ref, index) => (
                  <div className="premium-reference" key={index}>
                    {hasText(ref.name) && <h4>{ref.name}</h4>}
                    {hasText(ref.position) && <p>{ref.position}</p>}
                    {hasText(ref.phone) && <p>{ref.phone}</p>}
                    {hasText(ref.email) && <p>{ref.email}</p>}
                  </div>
                ))}
              </div>
            </PremiumSection>
          )}

          {visibleSocials.length > 0 && (
            <PremiumSection title="Social Links" accent={accent}>
              <div className="premium-tags">
                {visibleSocials.map((social, index) => (
                  <span key={index}>
                    {[social.platform, social.url].filter(Boolean).join(": ")}
                  </span>
                ))}
              </div>
            </PremiumSection>
          )}

        </main>
      </div>
    );
  }

  return (
    <div className={`resume-preview ${template?.layout || "single"}`}>
      <div
        className="resume-accent"
        style={{ background: template?.accent || "#111827" }}
      ></div>

      <div className="resume-paper">
        {showPersonalHeader && (
          <header className="resume-head">
            {hasText(personal.fullName) && <h2>{personal.fullName}</h2>}
            {hasText(personal.jobTitle) && <p>{personal.jobTitle}</p>}
            <p>
              {[personal.email, personal.phone, personal.location]
                .filter(Boolean)
                .join(" | ")}
            </p>
            <p>
              {[personal.linkedin, personal.portfolio].filter(Boolean).join(" | ")}
            </p>
          </header>
        )}

        {personalActive && hasText(personal.summary) && (
          <section>
            <h3>Professional Summary</h3>
            <p>{personal.summary}</p>
          </section>
        )}

        {visibleSkills.length > 0 && (
          <section>
            <h3>Skills</h3>
            <p>{visibleSkills.map((item) => item.name).join(", ")}</p>
          </section>
        )}

        {visibleExperience.length > 0 && (
          <section>
            <h3>Experience</h3>
            {visibleExperience.map((exp, index) => (
              <div className="resume-item" key={index}>
                {(hasText(exp.title) || hasText(exp.company)) && (
                  <h4>{[exp.title, exp.company].filter(Boolean).join(" - ")}</h4>
                )}
                <p className="muted">
                  {[
                    exp.location,
                    exp.startDate,
                    exp.currentWorking ? "Present" : exp.endDate,
                  ]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
                {lineArray(exp.bullets).length > 0 && (
                  <ul>
                    {lineArray(exp.bullets).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {visibleEducation.length > 0 && (
          <section>
            <h3>Education</h3>
            {visibleEducation.map((edu, index) => (
              <div className="resume-item" key={index}>
                {(hasText(edu.degree) || hasText(edu.institute)) && (
                  <h4>
                    {[edu.degree, edu.institute].filter(Boolean).join(" - ")}
                  </h4>
                )}
                <p className="muted">
                  {[
                    edu.location,
                    edu.startDate,
                    edu.currentStudying ? "Present" : edu.endDate,
                  ]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
                {hasText(edu.details) && <p>{edu.details}</p>}
              </div>
            ))}
          </section>
        )}

        {visibleProjects.length > 0 && (
          <section>
            <h3>Projects</h3>
            {visibleProjects.map((project, index) => (
              <div className="resume-item" key={index}>
                {hasText(project.name) && <h4>{project.name}</h4>}
                {hasText(project.tech) && <p className="muted">{project.tech}</p>}
                {lineArray(project.bullets).length > 0 && (
                  <ul>
                    {lineArray(project.bullets).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {visibleCertifications.length > 0 && (
          <section>
            <h3>Certifications</h3>
            {visibleCertifications.map((item, index) => (
              <div className="resume-item" key={index}>
                {hasText(item.name) && <h4>{item.name}</h4>}
                <p className="muted">
                  {[item.issuer, item.year].filter(Boolean).join(" | ")}
                </p>
              </div>
            ))}
          </section>
        )}

        {visibleAwards.length > 0 && (
          <section>
            <h3>Awards</h3>
            {visibleAwards.map((item, index) => (
              <div className="resume-item" key={index}>
                {hasText(item.name) && <h4>{item.name}</h4>}
                <p className="muted">
                  {[item.organization, item.year].filter(Boolean).join(" | ")}
                </p>
              </div>
            ))}
          </section>
        )}

        {visibleReferences.length > 0 && (
          <section>
            <h3>References</h3>
            {visibleReferences.map((ref, index) => (
              <div className="resume-item" key={index}>
                {hasText(ref.name) && <h4>{ref.name}</h4>}
                <p>
                  {[ref.position, ref.phone, ref.email]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
              </div>
            ))}
          </section>
        )}

        {visibleLanguages.length > 0 && (
          <section>
            <h3>Languages</h3>
            <p>{visibleLanguages.map((item) => item.name).join(", ")}</p>
          </section>
        )}

        {visibleHobbies.length > 0 && (
          <section>
            <h3>Hobbies</h3>
            <p>{visibleHobbies.map((item) => item.name).join(", ")}</p>
          </section>
        )}

        {visibleSocials.length > 0 && (
          <section>
            <h3>Social Links</h3>
            <p>
              {visibleSocials
                .map((item) =>
                  [item.platform, item.url].filter(Boolean).join(": ")
                )
                .join(" | ")}
            </p>
          </section>
        )}

        {visibleCustomSections.length > 0 &&
          visibleCustomSections.map((section, index) => (
            <section key={index}>
              <h3>{section.title || "Custom Section"}</h3>
              {hasText(section.content) && <p>{section.content}</p>}
            </section>
          ))}
      </div>
    </div>
  );
}
