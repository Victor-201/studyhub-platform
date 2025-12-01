export default class UserProfileDetails {
  #user_id;
  #bio;
  #gender;
  #birthday;
  #country;
  #city;

  constructor(row = {}) {
    this.#user_id = row.user_id;
    this.#bio = row.bio;
    this.#gender = row.gender;
    this.#birthday = row.birthday;
    this.#country = row.country;
    this.#city = row.city;
  }

  get user_id() { return this.#user_id; }
  get bio() { return this.#bio; }
  get gender() { return this.#gender; }
  get birthday() { return this.#birthday; }
  get country() { return this.#country; }
  get city() { return this.#city; }

  toJSON() {
    return {
      user_id: this.#user_id,
      bio: this.#bio,
      gender: this.#gender,
      birthday: this.#birthday,
      country: this.#country,
      city: this.#city,
    };
  }
}
