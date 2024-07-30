class Item < ApplicationRecord
  has_many :items_pfcs
  has_many :pfcs, through: :items_pfcs

  belongs_to :user
  
  validates :item_name, presence: true
  validates :item_kcal, presence: true
  validates :item_oil, presence: true
  validates :item_protein, presence: true
  validates :item_sugar, presence: true
end
