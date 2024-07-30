class Item < ApplicationRecord
  has_many :items_pfcs
  has_many :pfcs, through: :items_pfcs

  belongs_to :user
  
end
