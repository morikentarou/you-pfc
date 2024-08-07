class Pfc < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  has_many :pfc_items
  has_many :items, through: :pfc_items
  
  belongs_to :user
  belongs_to :timezone

  validates :day,                 presence: { message: "を入力してください。" }
  validates :time,                presence: { message: "を入力してください。" }
  validates :timezone_id,         presence: { message: "を選択してください。" }, numericality: { other_than: 1, message: "can't be blank" }
end
