class Goal < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :pfctype
  belongs_to :user

  validates :goal_kcal, presence: true
  validates :goal_oil, presence: true
  validates :goal_protein, presence: true
  validates :goal_sugar, presence: true

end
