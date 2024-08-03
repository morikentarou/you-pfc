FactoryBot.define do
  factory :item do
    association :user
    item_name       {Faker::Name.initials(number: 3)}
    item_kcal       { Faker::Number.between(from: 1500, to: 3000) }
    item_protein    { Faker::Number.between(from: 50, to: 100) }
    item_oil        { Faker::Number.between(from: 50, to: 150) }
    item_sugar      { Faker::Number.between(from: 100, to: 300) }
    store_id        { Faker::Number.between(from: 1, to: 7) }
    remarks         { Faker::Lorem.paragraph }
  end
end
