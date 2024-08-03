class Item < ApplicationRecord
  has_many :pfc_items
  has_many :pfcs, through: :pfc_items

  belongs_to :user
  
  validates :item_name, presence: true
  validates :item_kcal, presence: true
  validates :item_oil, presence: true
  validates :item_protein, presence: true
  validates :item_sugar, presence: true
end
