class Pfc < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :timezone
  has_many :items_pfcs
  has_many :items, through: :items_pfcs

  belongs_to :user

  validates :day,                 presence: true
  validates :time,                presence: true
  validates :timezone_id,         presence: true, numericality: { other_than: 1, message: "can't be blank" }
end
