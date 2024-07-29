class Goal < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :pfctype
  belongs_to :user

  validates :goal_kcal, presence: true
  validates :goal_oil, presence: true
  validates :goal_protein, presence: true
  validates :goal_sugar, presence: true
  
  def protein_percentage
    (goal_protein.to_f * 4 / total_calories * 100).floor
  end

  def sugar_percentage
    (goal_sugar.to_f * 4 / total_calories * 100).floor
  end

  def oil_percentage
    (goal_oil.to_f * 9 / total_calories * 100).floor
  end

  def total_calories
    (goal_protein * 4) + (goal_sugar * 4) + (goal_oil * 9)
  end

end
