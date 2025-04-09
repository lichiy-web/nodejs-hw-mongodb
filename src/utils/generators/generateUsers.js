import { faker } from '@faker-js/faker';
import {
  closeMongoConnection,
  initMongoConnection,
} from '../../db/initMongoConnection.js';
import { UserCollection } from '../../db/models/User.js';
import { PWD_HASH_SALT } from '../../constants/index.js';
import bcrypt from 'bcrypt';

class User {
  constructor() {
    const sex = faker.person.sex();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName(sex);
    const email = faker.internet.email({ firstName, lastName });
    const password = 'Qwerty123';
    const encryptedPassword = bcrypt.hashSync(password, PWD_HASH_SALT);
    // console.dir({ encryptedPassword });

    this.name = `${firstName} ${lastName}`;
    this.email = email;
    this.password = encryptedPassword;
  }
}

const usersNumber = 50;
const users = Array(usersNumber)
  .fill(0)
  .map(() => new User());
await initMongoConnection();
await UserCollection.create(users);
console.log(
  '50 users have been added to the "user" collection of "contacts" mongodb',
);
closeMongoConnection();
