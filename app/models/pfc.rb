class Pfc < ApplicationRecord
  has_many :items_pfcs
  has_many :items, through: :items_pfcs

  belongs_to :user
end
