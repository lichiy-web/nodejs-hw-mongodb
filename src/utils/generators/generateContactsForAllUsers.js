import { faker } from '@faker-js/faker';
import {
  closeMongoConnection,
  initMongoConnection,
} from '../../db/initMongoConnection.js';
import { UserCollection } from '../../db/models/User.js';
import { ContactCollection, contactSchema } from '../../db/models/contact.js';

const rndRange = (max, min = 0) => {
  return Math.round(min + Math.random() * (max - min + 1) - 0.5);
};

export class Contact {
  constructor(userId, schema) {
    const sex = faker.person.sex();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName(sex);
    const email = faker.internet.email({ firstName, lastName });
    const phoneNumber = faker.phone.number({ style: 'international' });
    email;
    const contactTypeValidValues = schema.tree.contactType.enum;

    this.userId = userId;
    this.name = `${firstName} ${lastName}`;
    this.phoneNumber = phoneNumber;
    this.email = [email, undefined][rndRange(1)];
    this.isFavourite = Boolean(rndRange(1));
    this.contactType =
      contactTypeValidValues[rndRange(contactTypeValidValues.length - 1)];
  }
}

await initMongoConnection();
const users = await UserCollection.find();
const contacts = users
  .map(user =>
    Array(rndRange(50, 100))
      .fill(0)
      .map(() => new Contact(user._id, contactSchema)),
  )
  .flat();
await ContactCollection.create(contacts);
console.log(
  `${contacts.length} contacts have been added to the "contacts" collection of "contacts" mongodb`,
);
closeMongoConnection();
