# RN Talent Solutions — Premium Website

A responsive, multi-page custom website for RN Talent Solutions, redesigned with a Squarespace-inspired editorial style: spacious layouts, refined typography, warm neutral backgrounds, restrained gold accents, polished cards, subtle motion, and an animated RN technology globe.

## Pages
- `index.html` — Home
- `services.html` — Services and capabilities
- `employers.html` — Hiring teams and employers
- `candidates.html` — Candidates and career profiles
- `about.html` — Company story and leadership
- `contact.html` — Contact form and contact details
- `styles.css` — Responsive visual design and animation
- `script.js` — Mobile navigation, scroll reveal, contact email preparation
- `three-scenes.js` — Optional Three.js WebGL scenes
- `assets/` — RN logo and custom illustrations

## Preview locally
Keep all files and the `assets` folder together. Open `index.html` in Chrome, or run a local static server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish
Upload the complete contents of this folder to your hosting provider's public web root (often `public_html`, `www`, or `htdocs`). Keep relative paths unchanged. The live 3D scene loads Three.js from a CDN, so that effect requires an internet connection; CSS animations provide a visual fallback.

## Contact form limitation
The contact form currently opens the visitor's default email application with the form details prefilled. It does not send or store submissions directly. Before launch, connect a secure server-side form handler or trusted form service, add spam protection, and publish a privacy notice before collecting candidate data.

## Before launch
- Confirm the business phone number and email.
- Add the correct legal business address and privacy policy.
- Add only verified client logos, certifications, testimonials, metrics, and case studies.


## Updated brand and inquiry forms
- Uses the supplied RN orange-and-white logo (`assets/rn-logo.png`) with a transparent background.
- Contact page now separates **Client / Vendor Job Requirement Submission** and **Candidate Resume / Profile Submission**.
- Forms prepare emails to `rntalentsolutions@gmail.com`. Since this is a static website, the email app opens and the sender must review and send. Candidate resumes must be manually attached in the email; files are not uploaded or stored by the website.
- For automatic secure form delivery and resume uploads, connect a form backend/service before publishing.
