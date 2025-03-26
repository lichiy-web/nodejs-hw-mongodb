import { getAllContacts, getContactById } from '../services/contacts.js';

export const rootController = (req, res) => {
  res.json({ availableRoutes: ['/', '/contacts', 'contacts/:contactId'] });
};

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    data: contacts,
    message: 'Successfully found contacts!',
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    res.status(404).json({
      message: 'Contact not found',
    });
    return;
  }

  res.status(200).json({
    status: 200,
    data: contact,
    message: `Successfully found contact with id ${contactId} !`,
  });
};
