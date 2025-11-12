import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { env } from '../config/env.js';
import { ensureDir } from './files.js';
import { slugify } from './string.js';

ensureDir(env.certificateBasePath);

const drawCertificate = ({ doc, user, event }) => {
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke('#0f172a');
  doc.fontSize(32).fillColor('#0f172a').text('Certificate of Participation', {
    align: 'center',
    underline: true,
  });

  doc.moveDown(1).fontSize(18).fillColor('#334155').text('This certificate is proudly presented to', {
    align: 'center',
  });

  doc.moveDown(0.5).fontSize(28).fillColor('#0f172a').text(user.name, {
    align: 'center',
  });

  doc.moveDown(0.5).fontSize(16).fillColor('#334155').text('for active participation in', {
    align: 'center',
  });

  doc.moveDown(0.5).fontSize(22).fillColor('#0f172a').text(event.title, {
    align: 'center',
  });

  doc.moveDown(1).fontSize(14).fillColor('#475569').text(`Held on ${new Date(event.startDate).toDateString()}`, {
    align: 'center',
  });

  doc.moveDown(2);
  doc.fontSize(12)
    .fillColor('#94a3b8')
    .text('CampusConnect', 100, doc.page.height - 120, { align: 'left' })
    .text('Club Admin Signature', doc.page.width - 200, doc.page.height - 120, { align: 'right' });
};

export const generateCertificatePdf = async ({ user, event }) => {
  const fileName = `${slugify(event.title)}_${slugify(user.name)}_${Date.now()}.pdf`;
  const filePath = path.join(env.certificateBasePath, fileName);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: 'landscape' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    drawCertificate({ doc, user, event });
    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return fileName;
};
