FactoryBot.define do
  factory :goal do
    association :user
    goal_kcal       { Faker::Number.between(from: 1500, to: 3000) }
    goal_protein    { Faker::Number.between(from: 50, to: 100) }
    goal_oil        { Faker::Number.between(from: 50, to: 150) }
    goal_sugar      { Faker::Number.between(from: 100, to: 300) }
    pfctype_id      { Faker::Number.between(from: 1, to: 4) }
  end
end
