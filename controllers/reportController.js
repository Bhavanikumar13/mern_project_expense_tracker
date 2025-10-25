import Transaction from '../models/Transaction.js';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import nodemailer from 'nodemailer';

// @desc    Generate PDF report
// @route   GET /api/reports/pdf
// @access  Private
export const generatePDFReport = async (req, res, next) => {
  try {
    const { startDate, endDate, type } = req.query;

    let query = { user: req.user.id };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name icon')
      .sort({ date: -1 });

    // Calculate totals
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=expense-report-${Date.now()}.pdf`);

    doc.pipe(res);

    // Add content
    doc.fontSize(20).text('Expense Tracker Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12);
    doc.text(`Total Income: $${income.toFixed(2)}`);
    doc.text(`Total Expense: $${expense.toFixed(2)}`);
    doc.text(`Balance: $${(income - expense).toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).text('Transactions', { underline: true });
    doc.fontSize(10);

    transactions.forEach((transaction, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }
      doc.text(
        `${index + 1}. ${transaction.title} - $${transaction.amount} (${transaction.category.name}) - ${new Date(transaction.date).toLocaleDateString()}`
      );
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Generate CSV report
// @route   GET /api/reports/csv
// @access  Private
export const generateCSVReport = async (req, res, next) => {
  try {
    const { startDate, endDate, type } = req.query;

    let query = { user: req.user.id };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name')
      .sort({ date: -1 });

    const fields = ['title', 'amount', 'type', 'category.name', 'date', 'notes', 'paymentMethod'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(transactions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=expense-report-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Send email report
// @route   POST /api/reports/email
// @access  Private
export const sendEmailReport = async (req, res, next) => {
  try {
    const { startDate, endDate, type, format } = req.body;

    let query = { user: req.user.id };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name')
      .sort({ date: -1 });

    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    let htmlContent = `
      <h2>Expense Tracker Report</h2>
      <p><strong>Period:</strong> ${startDate ? new Date(startDate).toLocaleDateString() : 'All'} to ${endDate ? new Date(endDate).toLocaleDateString() : 'All'}</p>
      <h3>Summary</h3>
      <ul>
        <li>Total Income: $${income.toFixed(2)}</li>
        <li>Total Expense: $${expense.toFixed(2)}</li>
        <li>Balance: $${(income - expense).toFixed(2)}</li>
      </ul>
      <h3>Recent Transactions</h3>
      <table border="1" cellpadding="5" style="border-collapse: collapse;">
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Type</th>
        </tr>
    `;

    transactions.slice(0, 20).forEach(t => {
      htmlContent += `
        <tr>
          <td>${new Date(t.date).toLocaleDateString()}</td>
          <td>${t.title}</td>
          <td>${t.category.name}</td>
          <td>$${t.amount.toFixed(2)}</td>
          <td>${t.type}</td>
        </tr>
      `;
    });

    htmlContent += '</table>';

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'Your Expense Tracker Report',
      html: htmlContent
    });

    res.status(200).json({ success: true, message: 'Report sent to your email' });
  } catch (error) {
    console.error('Email error:', error);
    next(error);
  }
};
