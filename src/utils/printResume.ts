import { PortfolioData } from '../types';

export function getPrintableResumeHtml(data: PortfolioData): string {
  const { profile, education, skills, experience, projects, certifications } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Curriculum Vitae - ${profile.name}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 15mm 15mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      line-height: 1.45;
      font-size: 10.5pt;
      padding: 24px;
      max-width: 820px;
      margin: 0 auto;
    }

    @media print {
      body {
        padding: 0;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
      a {
        text-decoration: none;
        color: inherit;
      }
    }

    /* Top control bar for interactive preview */
    .print-control-bar {
      position: sticky;
      top: 0;
      background: #18181b;
      color: #ffffff;
      padding: 12px 20px;
      margin: -24px -24px 24px -24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #ea580c;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 100;
    }

    .btn-print {
      background: #ea580c;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }

    .btn-print:hover {
      background: #c2410c;
    }

    .header-table {
      width: 100%;
      border-bottom: 2px solid #ea580c;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .candidate-name {
      font-size: 24pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .candidate-headline {
      font-size: 12pt;
      font-weight: 600;
      color: #c2410c;
      margin-top: 4px;
    }

    .contact-details {
      font-size: 9.5pt;
      color: #475569;
      margin-top: 6px;
      line-height: 1.5;
    }

    .contact-details span {
      display: inline-block;
      margin-right: 14px;
    }

    .section-title {
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0f172a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 16px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .resume-item {
      margin-bottom: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      color: #1e293b;
      font-size: 11pt;
    }

    .item-subtitle {
      font-size: 9.5pt;
      font-weight: 600;
      color: #c2410c;
      margin-top: 1px;
    }

    .item-date {
      font-size: 9pt;
      font-weight: 500;
      color: #64748b;
      font-family: monospace;
    }

    .item-description {
      font-size: 9.5pt;
      color: #334155;
      margin-top: 4px;
      line-height: 1.4;
    }

    .responsibilities-list {
      margin-top: 4px;
      padding-left: 18px;
      font-size: 9.5pt;
      color: #334155;
    }

    .responsibilities-list li {
      margin-bottom: 3px;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .project-card {
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 8px 10px;
      page-break-inside: avoid;
      break-inside: avoid;
      background: #fafafa;
    }

    .project-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 10pt;
    }

    .project-stack {
      font-size: 8.5pt;
      color: #ea580c;
      font-family: monospace;
      margin-top: 3px;
    }

    .skills-section {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    .skill-chip {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #1e293b;
      font-size: 9pt;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .cert-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cert-item {
      font-size: 9.5pt;
      color: #334155;
      flex: 1 1 45%;
    }

    .cert-year {
      color: #64748b;
      font-size: 8.5pt;
      font-family: monospace;
    }
  </style>
</head>
<body>

  <!-- Interactive top control bar when viewed in new tab -->
  <div class="print-control-bar no-print">
    <div>
      <span style="font-weight: bold; font-size: 14px;">Sandesh Vishwakarma — Curriculum Vitae</span>
      <span style="color: #a1a1aa; font-size: 12px; margin-left: 10px;">Print or Save as PDF</span>
    </div>
    <button class="btn-print" onclick="window.print()">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <!-- Header -->
  <div class="header-table">
    <div class="candidate-name">${profile.name}</div>
    <div class="candidate-headline">${profile.headline} • ${profile.tagline}</div>
    <div class="contact-details">
      <span>📧 ${profile.email}</span>
      ${profile.phone ? `<span>📞 ${profile.phone}</span>` : ''}
      <span>📍 ${profile.location}</span>
      ${profile.socials.linkedin ? `<span>🔗 ${profile.socials.linkedin}</span>` : ''}
      ${profile.socials.github ? `<span>💻 ${profile.socials.github}</span>` : ''}
    </div>
  </div>

  <!-- Professional Summary -->
  <div class="resume-item">
    <div class="section-title">Professional Summary</div>
    <div class="item-description">${profile.shortBio}</div>
  </div>

  <!-- Education -->
  ${education && education.length > 0 ? `
  <div class="section-title">Education</div>
  ${education.map(edu => `
    <div class="resume-item">
      <div class="item-header">
        <span>${edu.degree}</span>
        <span class="item-date">${edu.startYear} — ${edu.endYear}</span>
      </div>
      <div class="item-subtitle">${edu.institution}</div>
      ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
    </div>
  `).join('')}
  ` : ''}

  <!-- Experience -->
  ${experience && experience.length > 0 ? `
  <div class="section-title">Work Experience</div>
  ${experience.map(exp => `
    <div class="resume-item">
      <div class="item-header">
        <span>${exp.role}</span>
        <span class="item-date">${exp.startDate} — ${exp.endDate} (${exp.type})</span>
      </div>
      <div class="item-subtitle">${exp.organization}</div>
      ${exp.responsibilities && exp.responsibilities.length > 0 ? `
        <ul class="responsibilities-list">
          ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      ` : exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
    </div>
  `).join('')}
  ` : ''}

  <!-- Key Projects -->
  ${projects && projects.length > 0 ? `
  <div class="section-title">Key Projects & Technical Highlights</div>
  <div class="projects-grid">
    ${projects.slice(0, 4).map(proj => `
      <div class="project-card">
        <div class="project-title">${proj.name}</div>
        <div style="font-size: 8.5pt; color: #475569; margin-top: 3px; line-height: 1.35;">${proj.description}</div>
        <div class="project-stack">Tech: ${proj.technologies.slice(0, 4).join(', ')}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Technical Skills -->
  ${skills && skills.length > 0 ? `
  <div class="section-title">Technical Proficiencies</div>
  <div class="skills-section">
    ${skills.map(s => `<span class="skill-chip">${s.name}</span>`).join('')}
  </div>
  ` : ''}

  <!-- Certifications -->
  ${certifications && certifications.length > 0 ? `
  <div class="section-title">Certifications & Honors</div>
  <div class="cert-list">
    ${certifications.map(c => `
      <div class="cert-item">
        <strong>• ${c.name}</strong> <span class="cert-year">(${c.year})</span>
        <div style="font-size: 8.5pt; color: #64748b;">${c.issuingOrg}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div style="margin-top: 24px; padding-top: 8px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 8.5pt; color: #94a3b8;" class="no-print">
    Official Portfolio Resume • Generated from ${profile.name}'s Web Portfolio
  </div>

</body>
</html>`;
}

/**
 * Triggers printing of the candidate's resume cleanly across all browsers and iframe constraints.
 */
export async function printResume(data: PortfolioData): Promise<boolean> {
  const html = getPrintableResumeHtml(data);

  // Strategy 1: Hidden iframe print
  try {
    const printFrame = document.createElement('iframe');
    printFrame.setAttribute('style', 'visibility: hidden; position: fixed; right: 0; bottom: 0; width: 0; height: 0; border: 0;');
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      await new Promise(resolve => setTimeout(resolve, 350));

      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      // Clean up after small delay
      setTimeout(() => {
        try {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        } catch (_) {}
      }, 3000);

      return true;
    }
  } catch (err) {
    console.warn('Iframe print failed or blocked by sandbox. Falling back to dedicated window:', err);
  }

  // Strategy 2: Dedicated Blob URL / New Tab
  try {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
      // Auto trigger print in the new tab after DOM renders
      win.onload = () => {
        try {
          win.print();
        } catch (_) {}
      };
      return true;
    }
  } catch (err) {
    console.warn('Blob window open failed:', err);
  }

  // Strategy 3: Direct window.print() fallback
  window.print();
  return true;
}

/**
 * Opens the full printable resume in a fresh tab where the user can print or save as PDF without any iframe limits.
 */
export function openPrintableResumeTab(data: PortfolioData): void {
  const html = getPrintableResumeHtml(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
