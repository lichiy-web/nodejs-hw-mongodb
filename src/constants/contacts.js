export const RES_MSG = {
  200: {
    default: 'OK',
    getContactById: 'Successfully found a contact with id:',
    getAllContacts: 'Successfully found the contacts',
    upsertContact: 'Successfully updated a contact',
    patchContact: 'Successfully patched a contact',
    loginUser: 'Successfully logged in an user!',
    refreshUserSession: 'Successfully refreshed a session',
  },
  201: {
    default: 'Successfully created',
    createContact: 'Successfully created a contact!',
    upsertContact: 'Successfully created a contact!',
    registerUser: 'Successfully registered an user!',
  },
  204: { default: '' },
  400: { default: 'Bad request' },
  401: {
    default: 'Unauthorized',
    noSession: 'Session not found',
    noUser: 'User not found',
    notBearer: 'Auth header should be of type Bearer',
    noAuthHeader: 'Please provide Authorization header',
    accessTokenExpired: 'Access token expired',
  },
  404: {
    default: 'Rout not found',
    noContact: 'Contact not found',
  },
  500: { default: 'Something went wrong' },
};
