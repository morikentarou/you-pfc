FactoryBot.define do
  factory :user do
    name              {Faker::Name.initials(number: 2)}
    email             {Faker::Internet.email}
    password          {Faker::Internet.password(min_length: 6)}
    password_confirmation {password}
    birthday          {Faker::Date.birthday(min_age: 18, max_age: 65)}
  end
end