// controllers/contactController.js
const Contact = require('../models/Contact');

// Add or Update Contact Information
const addOrUpdateContact = async (req, res) => {
  const { email, linkedin, github, facebook, phone, address } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    let contact = await Contact.findOne({ email });

    if (contact) {
      // Update existing contact
      contact.linkedin = linkedin || contact.linkedin;
      contact.github = github || contact.github;
      contact.facebook = facebook || contact.facebook;
      contact.phone = phone || contact.phone;
      contact.address = address || contact.address;
    } else {
      // Create new contact
      contact = new Contact({ email, linkedin, github, facebook, phone, address, inquiries: [] });
    }

    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error saving contact info', error });
  }
};

// Submit an Inquiry
const submitInquiry = async (req, res) => {
  const { email, inquiry } = req.body;

  if (!email || !inquiry) {
    return res.status(400).json({ message: 'Email and inquiry are required.' });
  }

  try {
    let contact = await Contact.findOne({ email });

    if (contact) {
      // Add inquiry to existing contact
      contact.inquiries.push(inquiry);
    } else {
      // Create new contact with the inquiry
      contact = new Contact({ email, inquiries: [inquiry] });
    }

    await contact.save();
    res.status(201).json({ message: 'Inquiry submitted successfully.', inquiry: inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error });
  }
};

// Get Contact Information by Email
const getContactByEmail = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email parameter is required.' });
  }

  try {
    const contact = await Contact.findOne({ email });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact info', error });
  }
};

module.exports = {
  addOrUpdateContact,
  submitInquiry,
  getContactByEmail,
};
