class Pfc < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  has_many :pfc_items
  has_many :items, through: :pfc_items
  
  belongs_to :user
  belongs_to :timezone

  validates :day,                 presence: true
  validates :time,                presence: true
  validates :timezone_id,         presence: true, numericality: { other_than: 1, message: "can't be blank" }
end
