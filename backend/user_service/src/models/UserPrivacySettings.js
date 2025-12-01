export default class UserPrivacySettings {
  #user_id;
  #show_full_name;
  #show_bio;
  #show_gender;
  #show_birthday;
  #show_location;
  #show_avatar;
  #show_profile;
  #allow_messages;
  #allow_tagging;

  constructor(row = {}) {
    this.#user_id = row.user_id;
    this.#show_full_name = row.show_full_name;
    this.#show_bio = row.show_bio;
    this.#show_gender = row.show_gender;
    this.#show_birthday = row.show_birthday;
    this.#show_location = row.show_location;
    this.#show_avatar = row.show_avatar;
    this.#show_profile = row.show_profile;
    this.#allow_messages = row.allow_messages;
    this.#allow_tagging = row.allow_tagging;
  }

  get user_id() { return this.#user_id; }
  get show_full_name() { return this.#show_full_name; }
  get show_bio() { return this.#show_bio; }
  get show_gender() { return this.#show_gender; }
  get show_birthday() { return this.#show_birthday; }
  get show_location() { return this.#show_location; }
  get show_avatar() { return this.#show_avatar; }
  get show_profile() { return this.#show_profile; }
  get allow_messages() { return this.#allow_messages; }
  get allow_tagging() { return this.#allow_tagging; }

  toJSON() {
    return {
      user_id: this.#user_id,
      show_full_name: this.#show_full_name,
      show_bio: this.#show_bio,
      show_gender: this.#show_gender,
      show_birthday: this.#show_birthday,
      show_location: this.#show_location,
      show_avatar: this.#show_avatar,
      show_profile: this.#show_profile,
      allow_messages: this.#allow_messages,
      allow_tagging: this.#allow_tagging,
    };
  }
}
