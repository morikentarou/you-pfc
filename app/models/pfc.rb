class Pfc < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  has_many :pfc_items, dependent: :destroy
  has_many :items, through: :pfc_items
  
  belongs_to :user
  belongs_to :timezone

  validates :day,                 presence: { message: "を入力してください。" }
  validates :time,                presence: { message: "を入力してください。" }
  validates :timezone_id,         presence: { message: "を選択してください。" }, numericality: { other_than: 1, message: "can't be blank" }

  def total_kcal
    pfc_items.sum(:adjusted_kcal)
  end

  def total_protein
    pfc_items.sum(:adjusted_protein)
  end

  def total_sugar
    pfc_items.sum(:adjusted_sugar)
  end

  def total_oil
    pfc_items.sum(:adjusted_oil)
  end
end
